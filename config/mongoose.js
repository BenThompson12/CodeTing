// load models
require('../app/models/users');
require('../app/models/snippets');
require('../app/models/session');

module.exports = function(mongoose) {

	mongoose.connection.on('error', function(err) {
		console.log("ERROR: " + err);
	});

	mongoose.connection.once('open', function() {
		console.log("DEBUG: Connected to mongoDB");
	});
}