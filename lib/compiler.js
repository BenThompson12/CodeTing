var nodeGearman = require("node-gearman");
var gearman = new nodeGearman('localhost', 4730);

gearman.connect();

gearman.on("connect", function(){
    console.log("DEBUG: Connected to gearman");
});

gearman.on("error", function() {
    console.log("ERROR: Could not connect to gearman")
});

exports.run = function(language, code, stdin, callback) {
    var job = gearman.submitJob("run", JSON.stringify({
        language: language,
        code: code,
        stdin: stdin,
    }));

    job.on("data", function(data) {
        var result = JSON.parse(data.toString());
        callback(result);
    });

    job.on("error", function(error){ 
        console.log(error);
    });
}
