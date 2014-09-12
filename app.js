var http        = require('http'),
    mongoose    = require('mongoose'),
    passport    = require('passport'),
    express     = require('express.io');
    
app = express().http().io();
app.listen(8080);

/* Configure application */
require('./config/mongoose')(mongoose);
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);

/* Connect to database */
mongoose.connect('mongodb://localhost/test');
