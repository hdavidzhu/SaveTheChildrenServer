var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CompetencySchema   = new Schema({
	subjects: [
		{
			subject: String,
			grades: [
				{
					grade: Number,
					topics: [
						{
							topic: String
						}
					]
				}
			]
		}
	]
});

module.exports = mongoose.model('competency', CompetencySchema);