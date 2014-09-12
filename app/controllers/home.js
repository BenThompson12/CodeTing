exports.index = function(req, res) {
    var id = req.params.id;

    var loggedIn = (req.user != null);
    
    res.render('index', {
        title   : 'CodeTing',
        user    : req.user,
        loggedIn: loggedIn,
        id      : id,
    });
};
