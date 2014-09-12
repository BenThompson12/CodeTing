var home = require('../app/controllers/home');
var users = require('../app/controllers/users');
var snippets = require('../app/controllers/snippets');
var session = require('../app/controllers/session');

module.exports = function(app, passport) {

	//--------------------------------------------------
	// Index Route
	//--------------------------------------------------

	app.get('/:id?', home.index);

	app.get('/', home.index);

	//--------------------------------------------------
	// User Routes
	//--------------------------------------------------

	app.get('/user/login', users.login);

	app.get('/user/signup', users.signup);

	app.get('/user/manage', users.manage);

	app.get('/user/logout', users.logout);

	app.get('/user/get', users.get)

	app.post(
		'/user/login',
		passport.authenticate(
			'local', {
				successRedirect: '/',
				failureRedirect: '/user/login',
				failureFlash: true,
			}
		)
	);

	app.post('/user/signup', users.create);

	//--------------------------------------------------
	// Snippet Routes
	//--------------------------------------------------

	app.get('/snippet/collection', snippets.collection);

	app.post('/snippet/save', snippets.save);

	app.post('/snippet/delete', snippets.delete);

	app.get('/snippet/get/:id', snippets.get);

	app.post('/snippet/saveInfo', snippets.saveInfo);


	//--------------------------------------------------
	// Session Routes
	//--------------------------------------------------

	app.post('/session/new', session.new);

	app.get('/session/get/:id', session.get);

	//--------------------------------------------------
	// Socket Routes
	//--------------------------------------------------
	
	app.io.route('run', snippets.run);

	app.io.route('joinRoom', function(req) {
		var roomId = req.data.roomId;

		req.io.join(roomId);
	});

	app.io.route('sendMessage', function(req) {
		var roomId  = req.data.roomId;
		var name    = req.data.name;
		var message = req.data.message;
		
		req.io.room(roomId).broadcast('newMessage', {
			name: name,
			message: message,
		});
	})

};