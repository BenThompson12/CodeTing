var mongoose = require('mongoose'),
        User = mongoose.model('User');

exports.login = function(req, res) {

    var loggedIn = req.user;

    if (loggedIn) {
        return res.redirect('/');
    }

    res.render('users/login', {
        title  : "Login | CodeTing",
        message: req.flash('error'),
    });
};

exports.signup = function(req, res) {

    var loggedIn = req.user;

    if (loggedIn) {
        return res.redirect('/');
    }

    res.render('users/signup', {
        title   : "Signup | CodeTing",
        messages: req.flash('error'),
    });
};

exports.manage = function(req, res) {
    res.render('users/manage', {
        title: "Manage Account | CodeTing",
    });
}

exports.create = function(req, res) {
    var body = req.body;

    var email         = body.email,
        username      = body.username,
        password      = body.password,
        passwordAgain = body.passwordAgain;

    if (password != passwordAgain) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/user/signup');
    }

    var user = new User({
        email            : email,
        username         : username,
        encryptedPassword: password,
    });

    user.save(function(err) {
        if (err) {
            var errors = err.errors;
            var messages = [];

            for (var key in errors) {
                messages.unshift(errors[key].message)
            }

            req.flash('error', messages);
            return res.redirect('/user/signup');
        }
        
        req.logIn(user, function(err) {
            res.redirect('/');
        });
    });
}

exports.get = function(req, res) {
    var user = req.user;

    var id = null;
    var username = null;

    if (user) {
        id = user.id;
        username = user.username;
    }

    return res.json({
        id      : id,
        username: username,
    });
}

exports.logout = function(req, res) {
    req.logout()
    return res.redirect('/');
}

