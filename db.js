var mongoose   = require('mongoose');
mongoose.connect('mongodb://savethe:children@ds049150.mongolab.com:49150/information');

module.exports = mongoose.connection;