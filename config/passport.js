var mongoose = require('mongoose');

var User = mongoose.model('User');

var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findOne({ _id: id}, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({ username: username }, function(err, user) {
				if (err) {
					return done(err)
				}

				if (!user) {
					return done(null, false, { message: 'Incorrect username' });
				}

				if (!user.authenticate(password)) {
					return done(null, false, { message: 'Incorrect password' });
				}

				return done(null, user);
			})
		}
	));
}