var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var semSchema = new Schema({
	material: String,
	suggestions: String,
});

module.exports = mongoose.model('Semester', semSchema);

