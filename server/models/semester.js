var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var semSchema = new Schema({
	name: String,
	type: String,
	credits: Number,
});

module.exports = mongoose.model('Semester', semSchema);

