var express          = require('express.io'),
    flash            = require('connect-flash'),
    connectMongo     =  require('connect-mongo'),
    passportSocketIo = require('passport.socketio');

var mongoStore = connectMongo(express);

var cookieExpireTime = 3600000; // one hour

module.exports = function(app, passport) {

    var sessionStore = new mongoStore({
        url: 'mongodb://localhost/test',
        collection : 'sessions',
    });

    app.set('view engine', 'jade');
    app.set('views', __dirname + '/../app/views');

	app.use(express.cookieParser());
    
    app.use(express.json());
    app.use(express.urlencoded());
    
    app.use(express.methodOverride());

    app.use(express.session({
        secret: 'topsecret',
        expires : new Date(Date.now() + cookieExpireTime),
    	store: sessionStore,
    }));

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash());

    app.use(app.router);
    app.use(express.static(__dirname + '/../public'));
};