var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StudentSchema = new Schema({
	name: String,
	grade: String,
	minute: Number
});

module.exports = mongoose.model('student', StudentSchema);