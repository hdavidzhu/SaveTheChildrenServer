var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClassModuleSchema = new Schema({
	grade_id: Schema.Types.ObjectId,
	name: String
});

module.exports = mongoose.model('class_module', ClassModuleSchema);