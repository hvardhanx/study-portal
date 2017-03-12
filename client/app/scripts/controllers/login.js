'use strict';

/**
 * @ngdoc function
 * @name studyPortalApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the studyPortalApp
 */
angular.module('studyPortalApp')
.factory('safeApply', [function() {
    return function($scope, fn) {
        var phase = $scope.$root.$$phase;
        if(phase === '$apply' || phase === '$digest') {
            if (fn) {
                $scope.$eval(fn);
            }
        } else {
            if (fn) {
                $scope.$apply(fn);
            } else {
                $scope.$apply();
            }
        }
    };
}])
.controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$cookieStore', 'AuthService', 'AUTH_EVENTS', 'userService', 'Session', 'safeApply',
  function($scope, $rootScope, $location, $cookieStore, AuthService, AUTH_EVENTS, userService, Session, safeApply) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.login = function(credentials) {
    AuthService.login(credentials).then(function(user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);
      userService.user.isLogged = true;
      $cookieStore.put('loggedin', true);
      safeApply($scope);
      $location.path('/dashboard');
    }, function() {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      $cookieStore.put('loggedin', null);
    });
  };
  $scope.logout = function(user) {
    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    $scope.setCurrentUser(null);
     $location.path('/');
    userService.user.isLogged = false;
    Session.destroy();
    $cookieStore.put('loggedin', null);
    $cookieStore.put('sessionId', null);
  };
}])

// Communicating session changes
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})

// The AuthService
.factory('AuthService', function($http, $cookieStore, Session) {
  var authService = {};

  authService.login = function(credentials) {
    return $http
    .post('http://localhost:8080/api/login', credentials)
    .then(function(res) {
      Session.create(res.data.id, res.data.user.id,
                     res.data.user.email, res.data.user.role);
      $cookieStore.put('sessionId', res.data.id);
       return res.data.user;
    });
  };

  authService.isAuthenticated = function() {
    return !!Session.userId;
  };

  authService.isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
            authorizedRoles.indexOf(Session.userRole) !== -1);

  };

  return authService;
})
.service('Session', function() {
  this.create = function(sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function() {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
})
.controller('ApplicationController', ['$scope', '$rootScope', '$location', '$cookieStore', '$cookies','USER_ROLES','AuthService', 'userService', 'Session',
  function($scope, $rootScope, $location, $cookieStore, $cookies,USER_ROLES, AuthService, userService, Session) {

  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
  $scope.currentUser = Session.userId;
  //TODO
  // set user according to session and cookies
  //$scope.currentUser = $cookies.sessionId

  // restricting route access
  $scope.user = userService.user;
  $scope.$on('$routeChangeStart', function (e, next) {
     if (next.access !== undefined && !next.access.allowAnonymous && !userService.user.isLogged) {
                $location.path('/login');
            }
  });
  $rootScope.$on('$locationChangeStart', function (event, next) {
    for (var i in window.routes) {
      if (next.indexOf(i) !== -1) {
       if (!window.routes[i].access.allowAnonymous && !userService.user.isLogged) {
               $location.path('/login');
        }}}
  });

  $scope.setCurrentUser = function(user) {
    $scope.currentUser = user;
  };

  //Cookie Storage
  //using cookie to retain Session
  $scope.loggedIn = $cookieStore.get('loggedin');
  if ($scope.loggedIn === true) {
    $scope.loggedOut = null;
  }
  else{
    $scope.loggedOut = true;
    $scope.loggedIn = null;
  }
}])

// Access Control
//Restricting route access
.config(function($stateProvider, USER_ROLES) {
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: 'views/dashboard.html',
    data: {
      authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
    }
  });
})
.run(function($rootScope, AUTH_EVENTS, AuthService) {
  $rootScope.$on('$stateChangeStart', function(event, next) {
    var authorizedRoles = next.data.authorizedRoles;
    if (!AuthService.isAuthorized(authorizedRoles)) {
      event.preventDefault();
      if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });
})

// Cookie Security CSRF(Cross site request forgery)
// always set the correct CSRF header value before each request.
// set the CSRF request header to the current value of the CSRF
// cookie for any request type not in allowedMethods
.provider('myCSRF',function(){
  var headerName = 'X-CSRFToken';
  var cookieName = 'csrftoken';
  var allowedMethods = ['GET'];

  this.setHeaderName = function(n) {
    headerName = n;
  };
  this.setCookieName = function(n) {
    cookieName = n;
  };
  this.setAllowedMethods = function(n) {
    allowedMethods = n;
  };
  this.$get = ['$cookies', function($cookies){
    return {
      'request': function(config) {
        if(allowedMethods.indexOf(config.method) === -1) {
          // do something on success
          config.headers[headerName] = $cookies[cookieName];
        }
        return config;
      }
    };
  }];
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('myCSRF');
})
.run(['$http', '$cookies', function($http, $cookies) {
  $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
}]);

