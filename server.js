// Packages
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// Models, where we pull in the models for mongoDB data
var Test = require('./models/test');

// Mongoose instance and connection to our mongolab database
var db = require('./db');

// bodyParser
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3001; // set our port

// Routing
var router = express.Router(); // get an instance of the express Router

// Setting schemas
var StudentModel = require ('./models/student');

// Middleware that happens each time we make a request
router.use(function(req, res, next) {
	// console.log('someone made a request, was it you?');
	// console.log('Request ', req.body);
	// console.log(typeof req.body);
	// console.log(req.body.name);
	// console.log('Resource ', res.body);
	next(); // move to the next associated middleware
})

// Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Hooray! Welcome to our API!' });	
})

// API Routes
// This route will capture and save all teachers
router.route('/teacher')
	.post(function (req, res) {
		// Do shizniz here
		// 
	});
	
// This route will capture and save all students
router.route('/student')
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

	.get (function (req, res) {
		db.collection.find();

	});

// This route will fetch student information
router.route('/student/:student_name')
	.get(function (req, res) {
		// db.collection.find();
		
		var student_name = req.params.student_name;
		
		// console.log(typeof student_name);

		// var student_query = StudentModel.where({ name: student_name });
		// student_query.findOne(function (err, student) {
		// 	if (err) return handleError(err);
		// 	if (student) {
		// 		console.log(student);
		// 	}
		// });

		StudentModel.findOne({'name': student_name}, 'name minute', function (err, student) {
			if (err) return handleError(err);
			console.log("This worked... for now.");
			console.log('%s, %s minute.', student.name, student.minute);
		})

router.route('/student/all')
	.get(function (req, res) {
		StudentModel.find.sort('name => 1');
	})

// router.route('/student/all/:lower/:upper')
// 	.get(function (req, res) {
// 		StudentModel.find.sort(name => 1)
// 	})

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

// Register Routes
// All of our routes will be prefixed with /api
app.use('/api', router);

// Server
app.listen(port);
console.log('Server listening on', port);