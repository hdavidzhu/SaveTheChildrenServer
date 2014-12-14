var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClassModuleSchema = new Schema({
	grade_id: String,
	name: String
});

module.exports = mongoose.model('class_module', ClassModuleSchema);