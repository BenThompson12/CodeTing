var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SessionSchema = new Schema({
    shortId: String,
    owner: String,
    started: Date,
    snippetId: String,
    enabled: Boolean, 
});

mongoose.model('Session', SessionSchema);