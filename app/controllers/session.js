var mongoose = require('mongoose'),
    Session  = mongoose.model('Session'),
    shortId  = require('short-mongo-id');

exports.get = function(req, res) {
	var snippetId = req.params.id;

	Session.findOne( { snippetId: snippetId }, function(err, session) {
		if(session) {
			return res.json({
				owner: session.owner,
				id   : session.shortId,
			})
		}
		else {
			return res.json({
				exists: false,
			})
		}
	});

}

exports.new = function(req, res) {
	var user      = req.user;
	var snippetId = req.body.snippetId;

	var session = new Session({
	    owner    : user._id,
	    snippetId: snippetId,
	    started  : new Date(),
	    enabled  : true,
	});

    var sessionId = shortId(session._id);
    session.shortId = sessionId;

    session.save();

	return res.json({
        sessionId: sessionId,
    })
}

exports.disbale = function(req) {
	var user = req.uers;
	var snippetId = req.data.snippetId;

	Session.findOne( { snippetId: id }, function(err, session) {

		var inSession = (session != null && session.enabled);

		if (inSession) {
			session.enabled = false;
		}

		return res.json({
			success: true,
		})
	});


}