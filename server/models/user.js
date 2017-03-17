var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  username: String,
  fullName: String,
  rollNo: String,
  password: String,
  email: String,
  branch: String,
  semester: String,
});

module.exports = mongoose.model('User', userSchema);

