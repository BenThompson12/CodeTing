session = {
    new: function(snippetId, callback) {
        postRequest('/session/new/', {
            snippetId: snippetId,
        }, callback);
    },
    get: function(snippetId, callback) {
        $.get('/session/get/' + snippetId, callback);
    }
};

// helper function
function postRequest(url, data, callback) {
    $.ajax({
        url     : url, 
        dataType: 'json', 
        type    : 'POST', 
        data    : data,
        success : callback,
    });
}