var mongoose = require('mongoose'),
    Snippet  = mongoose.model('Snippet'),
    User     = mongoose.model('User'),
    shortId  = require('short-mongo-id'),
    compiler = require('../../lib/compiler'),
    timeago  = require('timeago');

exports.collection = function(req, res) {
    var user = req.user;

    Snippet.find({ owner: user._id }).sort('-updated').exec(function(err, doc) {
        var snippets = [];

        for(var i = 0; i < doc.length; i++) {
            var snippet = doc[i].toObject();

            snippet.lastUpdated = timeago(snippet.updated);
            snippets.push(snippet);
        }

        res.render('snippets/collection', {
            title   : "Your Snippets | CodeTing",
            snippets: snippets,
        });
    });
};

exports.delete = function(req, res) {
    var user = req.user;
    var id   = req.body.id;

    if (!user) {
        return res.json({
            success: false,
        });
    }

    Snippet.findOne( { shortId: id }, function(err, snippet) {
        if (!snippet || snippet.owner != user._id) {
            return res.json({
                success: false,
            });
        }

        snippet.remove();
    });

    return res.json({
        success: true,
    })
};

exports.run = function(req) {
    var language = req.data.language;
    var code     = req.data.code;
    var stdin    = req.data.stdin;

    compiler.run(language, code, stdin, function(result) {
        req.io.emit('result', {
            output: result.stdout,
         });
    });
};

exports.save = function(req, res) {
    var body = req.body;
    var user = req.user;

    var id       = body.id,
        code     = body.code,
        language = body.language;

    var userId = user ? user._id : "";

    if (!id) {
        var snippet = new Snippet({
            language: language,
            code    : code,
            name    : "Untitled",
            owner   : userId,
            updated : new Date(),
        });

        id = shortId(snippet._id);
        snippet.shortId = id;

        snippet.save();
    }
    else {
        Snippet.findOne({ shortId: id }, function(err, snippet) {
            if(!snippet) {
                return res.json({
                    success: false,
                })
            }

            snippet.code = code;
            snippet.language = language;

            snippet.updated = new Date();
            snippet.markModified('updated');

            snippet.save();
        });
    } 

    return res.json({
        success: true,
        id: id,
    });  
}

exports.saveInfo = function(req, res) {
    var body = req.body;
    var user = req.user;

    var id = body.id;
    var name = body.name;
    var tags = body.tags;

    Snippet.findOne({ shortId: id }, function(err, snippet) {
            if(!snippet) {
                return res.json({
                    success: false,
                });
            }

            snippet.name = name;
            snippet.tags = tags;

            snippet.updated = new Date();
            snippet.markModified('updated');

            snippet.save();
    });

    return res.json({
        success: true,
    })
}

exports.get = function(req, res) {
    var shortId = req.params.id;

    Snippet.findOne({ shortId: shortId }, function(err, snippet) {

        if (!snippet) {
            return res.json({
                success: false,
            })
        }

        if (snippet) {
            return res.json({
                success : true,
                language: snippet.language,
                name    : snippet.name,
                code    : snippet.code,
                owner   : snippet.owner,
                tags    : snippet.tags,
            })
        }
    });
}
