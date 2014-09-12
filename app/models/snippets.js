var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var SnippetSchema = new Schema({
	shortId: String,
	code: String,
	owner: String,
	name: String,
	language: String,
	tags: [String],
	updated: Date,
});

mongoose.model('Snippet', SnippetSchema);