var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeacherSchema = new Schema({
	name: String,
	help: []
});

module.exports = mongoose.model('teacher', TeacherSchema);