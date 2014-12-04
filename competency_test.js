var test_competency = {
	"subjects": [
		{
			"subject": "Math",
			"grades": [
				{
					"grade": 1,
					"topics": [
						{
							"topic": "Addition"
						}
					]
				},
				{
					"grade": 4,
					"topics": [
						{
							"topic": ["Fractions", "Long Division"]
						}
					]
				}
			]
		},
		{
			"subject": "English",
			"grades": [
				{
					"grade": 5,
					"topics": [
						{
							"topic": "Subject"
						}
					]
				}
			]
		},
		{
			"subject": "History",
			"grades": [
				{
					"grade": 7,
					"topics": [
						{
							"topic": "India"
						}
					]
				}
			]
		}
	]
};

var db = require('./db');
var CompetencyModel = require ('./models/competency');
var competencyRecord = new CompetencyModel(test_competency);
var util = require('util');

// competencyRecord.save(function(err) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log('success.');
// 			}
// 		});

CompetencyModel.find().exec(function (err, competency) {
			if (err) return handleError(err);
			// console.log(util.inspect(competency, {showHidden: false, depth: null}));
			console.log(util.inspect(competency, false, null));
		});