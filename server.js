// Packages
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// Models, where we pull in the models for mongoDB data
var ClassModule = require('./models/class_module');
var Grade = require('./models/grade');
var Subject = require('./models/subject');

// Mongoose instance and connection to our mongolab database
var db = require('./db');

// bodyParser
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/public');
app.set('view engine', 'jade');

// Set our port
var port = process.env.PORT || 3002; 

// Routing
var router = express.Router(); // get an instance of the express Router

// Test route to make sure everything is working
router.get('/', function(req, res) {
	res.json({ message: 'Hooray! Welcome to our API!' });	
});

// API Routes

router.route('/subjects')
	.get(function (req, res) {
		Subject
			.find()
			.exec(function (err, subjects) {
				if (err) return handleError(err);
				var subjects_list = [];
				for (i = 0; i < subjects.length; i++) { 
					subjects_list.push(subjects[i].name);
				}
				res.send(subjects_list);
			})
	});

router.route('/subject/:subject')
	.get(function (req, res) {
		var subject = req.params.subject;
		Subject
		  .where("name",subject)
		  .findOne()
		  .exec(function (err,subject_info) {
		  	if (err) return handleError(err);
		  	Grade
		  		.where("subject_id", subject_info._id)
		  		.select("_id name")	
		  		.find()
		  		.exec(function (err,grades) {
		  			res.send([subject_info, grades]);
		  		})
		  })
	});

router.route('/subject/:subject/:grade')
	.get(function (req, res) {
		var subject = req.params.subject;
		var grade = req.params.grade;
		Grade
			.where("subject_id").equals(subject)
			.where("name").equals(grade)
			.findOne()
			.exec(function (err, grade_info) {
		  	if (err) return handleError(err);
		  	ClassModule
		  		.where("grade_id", grade_info._id)
		  		.select("_id name")
		  		.find()
		  		.exec(function (err,class_modules) {
		  			res.send([grade_info, class_modules]);
		  		})
			})
	});

router.route('/class_module/:class_module')
	.get(function (req, res) {
		var class_module = req.params.class_module;
		ClassModule
			.where("name", class_module)
			.findOne()
			.exe(function (err, class_module_info) {
				res.send(class_module_info);
			})
	});

// Register Routes
// All of our routes will be prefixed with /api
app.use('/', router);

// Server
app.listen(port);
console.log('Server listening on', port);

/**
// This route will capture and save all teachers
router.route('/teachers')
	.get(function (req, res) {
	});
	
// This route will capture and save all students
router.route('/student/:student')
	.post(function (req, res) {
		var studentRecord = new StudentModel(req.body);
		studentRecord.save(function(err) {
			if (err) {
				console.log(err);
				res.status(500).json({status: 'failure'});
			} else {
				res.json({status: 'success'});
				console.log(StudentModel.find());
			}
		})
	})
	.put(function (req, res) {
		var conditions = { name: req.params.student }
		var update = { $inc: { visits: 1 }}
		var options = { multi: true };

		StudentModel.update(conditions, update, options, callback);

		function callback (err, numAffected) {
		  // numAffected is the number of updated documents
		  console.log(numAffected);
		})
	})
	.get (function (req, res) {
		db.collection.find();
	});

router.route('/students/all')
	.get(function (req, res) {
		// var students= StudentModel.find.sort('name => 1');
		// StudentModel.aggregate({$project:{name: 1}}).exec(function (err, students) {
		// 	if (err) return handleError(err);
		// 	res.send(students);
		// })
		StudentModel.find().exec(function (err, students) {
			if (err) return handleError(err);
			res.send(students);
		})
	});

router.route('/students/some/:lower/:upper')
	.get(function (req, res) {
		StudentModel.find().sort(name => 1).exec
	});

// This route will fetch student information
router.route('/student/:student_name')
	.get(function (req, res) {
		
		var student_name = req.params.student_name;		
		StudentModel.findOne({'name': student_name}, 'name minute', function (err, student) {
			if (err) return handleError(err);
			res.send(student);
		})
	});

// This route will capture and save all notes about students
router.route('/student/note')
	.post(function (req, res) {
		// Do shizniz here	
	});

router.route('/tests')
	// create a test at POST https://localhost:3000/api/test
	.post(function (req, res){

		var test = new Test(); // create a new instance of test
		test.name = req.body.name; // what is this test's name in the request?

		test.save(function (err) { // yey 4 err hndlng doh
			if (err) res.send(err);
			res.json({message: 'Test created'});
		});
	})

	.get(function (req, res) {
		Test.find(function (err, tests) {
			if (err) res.send(err);
			res.json(tests);
		})
	});

router.route('/tests/:test_id')
	// Get a specific test's information
	.get(function(req, res) {
		Test.findById(req.params.test_id, function(err, test) {
			if (err) res.send(err);
			res.json(test);
		});
	})
	// Update the information within a test
	.put(function(req, res) {
		Test.findById(req.params.test_id, function(err, test) {
			if (err) res.send(err);
			test.name = req.body.name; 	// update the test info

			// save the test
			test.save(function(err) {
				if (err) res.send(err);
				res.json({ message: 'Test updated!' });
			});

		});
	})
	.delete(function(req, res) {
		Test.remove({ _id: req.params.test_id }, 

		function(err, test) {
			if (err)es.send(err);
			res.json({ message: 'Successfully deleted' });
		});
	});
**/