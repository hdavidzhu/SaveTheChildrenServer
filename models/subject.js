var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubjectSchema = new Schema({
	_id: String,
	name: String
});

module.exports = mongoose.model('subject', SubjectSchema);