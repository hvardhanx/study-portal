// server.js

// BASE SETUP
// =============================================================================

var port = process.env.PORT || 8080; // set our port

// Connecting MongoDB using mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// call the packages we need
var flash = require('connect-flash');
var express = require('express'); // call express
var bodyParser = require('body-parser'); // call body parser
var bCrypt = require('bcrypt-nodejs'); // call bcrypt
var multer = require('multer');

var app = express(); // define our app using express
var User = require('./models/user');
var SemUser = require('./models/semester');

// Validates password using bCrypt hash
var isValidPassword = function(user, password) {
  return bCrypt.compareSync(password, user.password);
}

// Generates hash using bCrypt
var createHash = function(password) {
  console.log(password);
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
app.use(expressSession({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'jade');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport/login.js
passport.use('login', new LocalStrategy({
  passReqToCallback: true
},
function(req, username, password, done) {
  // check in mongo if a user with username exists or not
  User.findOne({
    'username': username
  },
  function(err, user) {
    // In case of any error, return using the done method
    if (err)
      return done(err);
    // Username does not exist, log error & redirect back
    if (!user) {
      console.log('User Not Found with username ' + username);
      return done(null, false,
                  req.flash('message', 'User Not found.'));
    }
    // User exists but wrong password, log the error
    if (!isValidPassword(user, password)) {
      console.log('Invalid Password');
      return done(null, false,
                  req.flash('message', 'Invalid Password'));
    }
    // User and password both match, return user from
    // done method which will be treated like success
    return done(null, user);
  }
);
}));

// passport/signup.js
passport.use('signup', new LocalStrategy({
  passReqToCallback: true
},
function(req, username, password, done) {
  findOrCreateUser = function() {
    // find a user in Mongo with provided username
    User.findOne({
      'username': username
    }, function(err, user) {
      // In case of any error return
      if (err) {
        console.log('Error in SignUp: ' + err);
        return done(err);
      }
      // already exists
      if (user) {
        console.log('User already exists');
        return done(null, false,
                    req.flash('message', 'User Already Exists'));
      } else {
        // if there is no user with that email
        // create the user
        var newUser = new User();
        // set the user's local credentials
        newUser.username = username;
        newUser.fullName = req.param('fullName');
        newUser.rollNo = req.param('rollNo');
        newUser.password = createHash(password);
        newUser.email = req.param('email');
        newUser.contact = req.param('contact');
        newUser.branch = req.param('branch');
        newUser.semester = req.param('semester');
        console.log(req.param);

        // save the user
        newUser.save(function(err) {
          if (err) {
            console.log('Error in Saving user: ' + err);
            throw err;
          }
          console.log('User Registration succesful');
          return done(null, newUser);
        });
      }
    });
  };
  // Delay the execution of findOrCreateUser and execute
  // the method in the next tick of the event loop
  process.nextTick(findOrCreateUser);
}
));

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if ('OPTIONS' == req.method) {
    return res.sendStatus(200);
  }
  next(); // make sure we go to the next routes and don't stop here
});

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ //multer settings
                storage: storage
            }).single('file');

// more routes for our API will happen here

// on routes used in authentication
// ----------------------------------------------------

/* GET login page. */
router.get('/', function(req, res) {
  // Display the Login page with any flash message, if any
  res.render('index', {
    message: req.flash('message')
  });
});

/** API path that will upload the files */
router.post('/upload', function(req, res) {
    console.log('File Uploaded');
    upload(req,res,function(err){
        if(err){
              res.json({error_code:1,err_desc:err});
             return;
        }
          res.json({error_code:0,err_desc:null});
    });
});

/* Handle Login POST */
router.post('/login', function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting login
    if (!user) {
      return res.send({
        success: false,
        message: 'login failed'
      });
    }
    return res.send({
      id: req.sessionID,
      user: {
        name: user.fullName,
        roll: user.rollNo,
        contact: user.contact,
        id: user.username,
        email: user.email,
        branch: user.branch,
        semester: user.semester,
        role: "guest",
      },
      success: true,
      message: 'login succeeded'
    });
  })(req, res, next);
});

/* GET Registration Page */
router.get('/signup', function(req, res) {
  res.render('register', {
    message: req.flash('message')
  });
});

router.post('/signup', function(req, res, next) {
  passport.authenticate('signup', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting signup
    if (!user) {
      return res.send({
        success: false,
        message: 'signup failed'
      });
    }
    return res.send({
      id: req.sessionID,
      user: {
        id: user.username,
        role: "guest"
      },
      success: true,
      message: 'signup succeeded'
    });
  })(req, res, next);
});

/* Handle Logout */
router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/* GET Home Page */
router.get('/dashboard', isAuthenticated, function(req, res) {
  res.render('dashboard', {
    user: req.user
  });
});

var semArr = [
        {
            id: 1,
            name: 'Data Communication',
            type: 'Theory',
            credits: 4,
            branch: 'CSE',
            semester: '5'
        }, {
            id: 2,
            name: 'Operating Systems',
            type: 'Theory',
            credits: 3,
            branch: 'CSE',
            semester: '4'
        }, {
            id: 3,
            name: 'Database Management Systems',
            type: 'Theory',
            credits: 4,
            branch: 'CSE',
            semester: '4'
        }, {
            id: 4,
            name: 'Design and Analysis of algorithms',
            type: 'Practical',
            credits: 2,
            branch: 'CSE',
            semester: '5'
        }, {
            id: 4,
            name: 'Design and Analysis of algorithms',
            type: 'Practical',
            credits: 2,
            branch: 'hey',
            semester: 'hey'
        }
      ];

for(var i = 0; i < semArr.length; i++) {
  // console.log(semArr[i]);
  var sem = new SemUser(semArr[i]);
  sem.save(function(err) {
    if(err) {
      console.log("Error!");
      throw err;
    }
    console.log('Data saved!');
  });
}

/* GET Courses */
router.get('/courses', isAuthenticated, function(req, res) {
  console.log("Hello");
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

