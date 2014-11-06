var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TeacherSchema   = new Schema({
	name: String
});

module.exports = mongoose.model('teaher', TeacherSchema);