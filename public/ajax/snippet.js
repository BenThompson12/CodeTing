snippet = {
    get: function(id, callback) {
        $.get('/snippet/get/' + id, callback);
    },

    save: function(id, language, code, callback) {
        postRequest('/snippet/save', {
            id: id,
            language: language,
            code: code,
        }, callback);
    },

    saveInfo: function(id, name, tags, callback) {
        postRequest('/snippet/saveInfo', {
            id: id,
            name: name,
            tags: tags,
        }, callback);

    },

    delete: function(id, callback) {
        postRequest('/snippet/delete', {
            id: id,
        }, callback);
    },

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