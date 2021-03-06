// Packages
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// Models, where we pull in the models for mongoDB data
var ClassModule = require('./models/class_module');
var Grade = require('./models/grade');
var Subject = require('./models/subject');
var Teacher = require('./models/teacher');

// Mongoose instance and connection to our mongolab database
var db = require('./db');

// bodyParser
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/public');
app.set('view engine', 'jade');

// Set our port
var port = process.env.PORT || 3000; 

function frequency(arr) {
  var a = [], b = [], prev;
  var jsonFrequency = {};

  arr.sort();
  for ( var i = 0; i < arr.length; i++ ) {
    if ( arr[i] !== prev ) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length-1]++;
    }
    prev = arr[i];
  }

  for ( var i = 0; i < a.length; i++ ) {
  	jsonFrequency[a[i]] = b[i];
  }

  return jsonFrequency;
}	

// Routing
var router = express.Router(); // get an instance of the express Router

// Test route to make sure everything is working
router.get('/', function(req, res) {
	res.json({ message: 'Hooray! Welcome to our API!' });	
});

// API Routes

// Get all subjects.
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
				res.send({"subjects": subjects_list});
			})
	});

// Get all grades of the subject.
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
		  			res.send({subject_info: grades});
		  		})
		  })
	});

// Get all class modules of the grade.
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
		  		// .select("_id name")
		  		.find()
		  		.exec(function (err,class_modules) {
		  			res.send({grade_info: class_modules});
		  		})
			})
	});

// Get information on the class module.
router.route('/class_module/:class_module')
	.get(function (req, res) {
		var class_module = req.params.class_module;
		ClassModule
			.where("name", class_module)
			.findOne()
			.exec(function (err, class_module_info) {
				res.send(class_module_info);
			})
	});

router.route('/tna')
	.get(function (req, res) {
		var combined_modules = [];
		Teacher
			.find()
			// .select('help')
			.exec(function (err, teachers) {
				if (err) return handleError(err);
				for (i = 0; i < teachers.length; i++) {
					combined_modules = combined_modules.concat(teachers[i].help);
				}
				res.send(frequency(combined_modules));
			})
	});

// View all the tutors that need help for this class Module.
router.route('/tna/:class_module')
	.get(function (req, res) {
		var class_module = req.params.class_module;
		var teacher_names = [];
		Teacher
			.find({'help': class_module})
			.select('name')
			.exec(function (err, teachers) {
				if (err) return handleError(err);
				for (i = 0; i < teachers.length; i++) {
					teacher_names.push(teachers[i].name);
				}
				res.send({"teachers": teacher_names});
			})
	});

// Clear all module.
router.route('/tna/:class_module/delete')
	.get(function (req, res) {
		var class_module = req.params.class_module;
		Teacher
			.find({'help': class_module})
			.exec(function (err, teachers) {
				if (err) return handleError(err);
				for (i = 0; i < teachers.length; i++) {
					teachers[i].help.pull(class_module);
					teachers[i].save(function(err) {
			  		if (err) {
			  			console.log(err);
			  			res.status(500).json({status: 'failure'});
			  		} else {
			  			res.json({status: 'success'});
			  		}
			  	})
				}
			})
	});

// Get all teachers.
router.route('/teachers')
	.get(function (req, res) {
		Teacher
			.find()
			.exec(function (err, teachers) {
				if (err) return handleError(err);
				var teachers_list = [];
				for (i = 0; i < teachers.length; i++) { 
					teachers_list.push(teachers[i].name);
				}
				res.send({"teachers": teachers_list});
			})
	})
	.post(function (req, res) {
		var teacherRecord = new Teacher(req.body);

		Teacher
			.find({ name: req.body.name })
			.exec(function (err, teachers) {
				if (err) return handleError(err);
				if (teachers.length == 0) {
					teacherRecord.save(function (err, teacherRecord) {
						if (err) return console.log(err);
						console.dir(teacherRecord);
		  			res.json({status: 'success'});
					});
				}
		});
	});

// Remove teachers.
router.route('/teachers/delete/:teacher_name')
	.get(function (req, res) {
		teacher_name = req.params.teacher_name
		Teacher
			.find({'name': teacher_name})
			.remove(function (err) {
				res.send(err);
			});
	});

// Get information on specific teacher and their modules.
router.route('/teacher/:teacher')
	.get(function (req, res) {
			var teacher = req.params.teacher;
			Teacher
			  .where("name",teacher)
			  .findOne()
			  .exec(function (err,teacher_info) {
			  	if (err) return handleError(err);
			  	res.send(teacher_info);
			  })
		})
	.post(function (req, res) {
			var teacher = req.params.teacher;
			var classModuleRecord = new ClassModule(req.body);

			Teacher
			  .where("name",teacher)
			  .findOne()
			  .exec(function (err,teacher_info) {
			  	if (err) return handleError(err);
			  	teacher_info.help.push(req.body.module);

			  	teacher_info.save(function(err) {
			  		if (err) {
			  			console.log(err);
			  			res.status(500).json({status: 'failure'});

			  		} else {
			  			res.json({status: 'success'});
			  		}
			  	})
			  })
		});


// This is written as a POST request because Volley cannot pass arguments in its DELETE request.
router.route('/teacher/:teacher/delete/')
	.post(function (req, res) {
			var teacher = req.params.teacher;

			Teacher
			  .where("name",teacher)
			  .findOne()
			  .exec(function (err,teacher_info) {
			  	if (err) return handleError(err);
			  	teacher_info.help.pull(req.body.module);

			  	teacher_info.save(function(err) {
			  		if (err) {
			  			console.log(err);
			  			res.status(500).json({status: 'failure'});

			  		} else {
			  			res.json({status: 'success'});
			  		}
			  	})
			  })
		});

// Register Routes
// All of our routes will be prefixed with /api
app.use('/', router);

// Server
app.listen(port);
console.log('Server listening on', port);