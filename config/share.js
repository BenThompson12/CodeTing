var sharejs = require('share').server;

module.exports = function(app) {
	var options = {
		db: {
			type: 'none',
		}
	};
	sharejs.attach(app, options);
};