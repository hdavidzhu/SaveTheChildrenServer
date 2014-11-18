// Packages
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// Models, where we pull in the models for mongoDB data
var Test = require('./models/test');

// Mongoose instance and connection to our mongolab database
var mongoose   = require('mongoose');
mongoose.connect('mongodb://savethe:children@ds049150.mongolab.com:49150/information');

// bodyParser, whoot
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/public');
app.set('view engine', 'jade');

var port = process.env.PORT || 3000; // set our port

// Routing
var router = express.Router(); // get an instance of the express Router

// Middleware that happens each time we make a request
router.use(function(req, res, next) {
	console.log('someone made a request, was it you?');
	next(); // move to the next associated middleware
})

// Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.route('/')
	.get(function(req, res) {
	console.log('hooray! welcome to our api!');	
	Test.find(function (err, tests) {
			if (err) res.send(err);
			res.render('index', {tests:tests});
			console.log('that worked');
			console.log(tests);
	})
	});

// API Routes
// This route will capture and save all teachers
router.route('/teacher')
	.post(function (req, res) {
		// Do shizniz here
	});

// This route will capture and save all students
router.route('/student')
	.post(function (req, res) {
		// Do shizniz here
	});

// This route will capture and save all notes about students
router.route('/student/note')
	.post(function (req, res) {
		// Do shizniz here
	});

router.route('/tests')
	// create a test at POST https://localhost:300/api/test
	.post(function (req, res){

		console.log('req.body', req.body);

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
			res.json(tests)
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
// all of our routes will be prefixed with /api
app.use('/api', router);

// Server
app.listen(port);
console.log('Server listening on', port);
