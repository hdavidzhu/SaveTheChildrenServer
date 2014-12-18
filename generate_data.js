var bodyParser = require('body-parser');

// Models, where we pull in the models for mongoDB data
var ClassModule = require('./models/class_module');
var Grade = require('./models/grade');
var Subject = require('./models/subject');
var Teacher = require('./models/teacher');

// Mongoose instance and connection to our mongolab database
var db = require('./db');

var cap = 2;

var state = "make subjects";

switch (state) {
	case "make subjects":
		for (var i = 0; i < cap; i++) {

			var subjectRecord = new Subject();
			subjectRecord.name = "Test";
			subjectRecord.save( function(err, subjectRecord) {});
		}

		break;
	default:
		return;
}

