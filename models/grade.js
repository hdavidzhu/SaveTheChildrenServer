var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var GradeSchema = new Schema({
	subject_id: String,
	name: String
});

module.exports = mongoose.model('grade', GradeSchema);