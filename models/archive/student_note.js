var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StuNoteSchema   = new Schema({
	student_name: String,
	teacher_name: String,
	time: Date,
	note: String
});

module.exports = mongoose.model('student_note', StuNoteSchema);