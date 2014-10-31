// Packages
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// Mongoose instance and connection to our mongolab database
var mongoose   = require('mongoose');
mongoose.connect('mongodb://<savethe>:<children>@ds049150.mongolab.com:49150/information');

// Models, where we pull in the models for mongoDB data
var Test = require('./models/test');

// bodyParser, whoot
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; // set our port

// Routing
var router = express.Router(); // get an instance of the express Router

// Middleware that happens each time we make a request
router.use(function(req, res, next) {
	console.log('someone made a request, was it you?');
	next(); // move to the next associated middleware
})

// Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
})

// API Routes
router.route('/tests')
	// create a test at POST https://localhost:300/api/test
	.post(function (req, res){

		var test = new Test(); // create a new instance of test
		test.name = req.body.name; // what is this test's name in the request?

		console.log ('your variable was set');
		console.log(test.name);
		test.save(function (err) { // yey 4 err hndlng doh
			if (err) 
				res.send(err);

			res.json({message: 'Test created'});
		});

	})

	.get(function (req, res) {
		Test.find(function (err, tests) {
			if (err) res.send(err);
			res.json(tests)
		})
	})



// Register Routes
// all of our routes will be prefixed with /api
app.use('/api', router);

// Server
app.listen(port);
console.log('Server listening on', port);
