$(document).ready(function() {

    var host = "localhost";

    init();

    function init() {
        $('#tags').tagit();

        hideChat();
    }

    $('#output').val("Console output");

    /* ***********************************************/
    /* Model Events                                  */
    /* ***********************************************/

    // Object to store state of application
    state = {};

    /* Set default language */
    state.selectedLanguage = "Python";


    $.subscribe('setSnippetId', function(o, snippetId) {
        state.snippetId = snippetId;

        $.publish('snippetIdUpdated', snippetId);
    });

    $.subscribe('setSessionId', function(o, sessionId) {
        state.sessionId = sessionId;

        $.publish('sessionIdUpdated', sessionId);
    });

    $.subscribe('setSessionOwner', function(o, sessionOwner) {
        state.sessionOwner = sessionOwner;

        $.publish('sessionOwnerUpdated', sessionOwner);
    });

    $.subscribe('setLanguage', function(o, language) {
        state.selectedLanguage = language;

        $.publish('languageUpdated', language);
    });

    $.subscribe('setCode', function(o, code) {
        state.code = code;

        $.publish('codeUpdated', code);
    });

    $.subscribe('setDisplayName', function(o, displayName) {
        state.displayName = displayName;

        $.publish('displayNameUpdated', displayName);
    });

    $.subscribe('setOwner', function(o, owner) {
        state.owner = owner;

        $.publish('ownerUpdated', owner);
    });

    $.subscribe('setUserId', function(o, userId) {
        state.userId = userId;

        $.publish('userIdUpdated', userId);
    });

    $.subscribe('setUsername', function(o, username) {
        state.username = username;

        $.publish('usernameUpdated', username);
    });

    $.subscribe('setSnippetName', function(o, snippetName) {
        state.snippetName = snippetName;

        $.publish('snippetNameUpdated', snippetName);
    });

    $.subscribe('setTags', function(o, data) {
        state.tags = data.tags;

        $.publish('tagsUpdated', data.tags);
    });

    /* ***********************************************/
    /* Socket Events                                 */
    /* ***********************************************/

    socket.on('result', function(data) {
        $.publish("runResult", data);
        
    });

    /* ***********************************************/
    /* Chatroom Events                               */
    /* ***********************************************/

    $.subscribe('sendMessage', function(o, data) {
        var message = data.message;
        var roomId  = state.sessionId;
        var name    = state.displayName;

        if(name == null) {
            name = "Guest";
        }

        chat.sendMessage(roomId, name, message);

        $.publish('messageSent', {
            name   : name,
            message: message,
        });
    });


    chat.onNewMessage(function(data) {
        $.publish('newMessage', data);
    });

    /* ***********************************************/
    /* Controller Events                             */
    /* ***********************************************/

    $.subscribe('saveSnippet', function() {
        var id       = state.snippetId;        
        var language = state.selectedLanguage;
        var code     = state.code;

        snippet.save(id, language, code, function(data) {
            $.publish('savedSnippet', data);
        })
    });

    $.subscribe('saveSnippetInfo', function(o, data) {
        var id = state.snippetId;

        var name = data.name;
        var tags = data.tags;

        console.log(tags);

        snippet.saveInfo(id, name, tags, function(data) {
            alert("Saved info");
        });

    })

    $.subscribe('forkSnippet', function() {
        var id       = undefined;
        var name     = state.snippetName;
        var language = state.selectedLanguage;
        var code     = state.code;

        snippet.save(id, name, language, code, function(data) {
            $.publish('forkedSnippet', data);
        })
    });

    $.subscribe('runSnippet', function(o, data) {
        var language = state.selectedLanguage;
        var code     = state.code;

        socket.emit('run', {
            language: language,
            code    : code,
        });
    });

    $.subscribe('newSnippet', function() {
        window.open("/");
    });

    $.subscribe('forkedSnippet', function(o, data) {
        var snippetId = data.id;
        window.location.replace("/" + snippetId);
    });

    $.subscribe('savedSnippet', function(o, data) {
        var snippetId = data.id;
        window.location.replace("/" + snippetId);
    });

    $.subscribe('confirmCollab', function() {
        var id = state.snippetId;

        session.new(id, function(data) {
            $.publish('startSession', data);
        })
    });

    $.subscribe('startSession', function(o, data) {
        console.log("startSession");

        var sessionId   = data.sessionId;
        var displayName = state.displayName;
        var code        = state.code;

        if(!displayName) {
            $.publish('requestDisplayName');
        }

        chat.joinRoom(sessionId);

        openDocument(sessionId, code);
    });

    $.subscribe('joinSession', function(o, sessionId) {
        var displayName = state.displayName;

        if(!displayName) {
            $.publish('requestDisplayName');
        }

        chat.joinRoom(sessionId);

        openDocument(sessionId, null);
    });


    $.subscribe('confirmDisplayName', function(o, name) {
        $.publish('setDisplayName', name);
    });

    $.subscribe('finalize', function(o, state) {
        var sessionId   = state.sessionId;
        var snippetId   = state.snippetId;
        var code        = state.code;
        var displayName = state.displayName;

        if(sessionId) {
            $.publish('joinSession', sessionId);
        }
        else if(snippetId) {
            $.publish('loadCode', code);
        }

    });



    /* ***********************************************/
    /* User Interface Events                         */
    /* ***********************************************/

    $('#message').bind("enterKey", function(e) {
        var message = $('#message').val();

        if(message == "") {
            return;
        }

        $.publish('sendMessage', {
            message: message,
        });

    });

    $ ("#language li a").click(function() {
        var language = $(this).text();

        $.publish('setLanguage', language);
    });

    $("#new").click(function() {
        $.publish('newSnippet');
    });

    $("#enable-collab").click(function() {
        $.publish('enableCollab');
    });

    $("#fork").click(function() {
        $.publish('forkSnippet');
    });

    $("#save").click(function() {
       $.publish('saveSnippet');
    });

    $("#run").click(function() {        
        $.publish('runSnippet');
    });

    $("#confirm-name").click(function() {
        var displayName = $('#displayname').val();

        $.publish('confirmDisplayName', displayName);
    });

    $("#save-info").click(function() {
        var name = $('#snippetName').val();
        var tags = $('#tags').tagit("assignedTags");

        $.publish('saveSnippetInfo', {
            name: name,
            tags: tags,
        });
    });

    Mousetrap.bind('ctrl+s', function(e) {
        $.publish('saveSnippet');
    });

    Mousetrap.bind('ctrl+r', function(e) {
        $.publish('runSnippet');
    });

    aceSession.on('change', function(o) {
        text = aceSession.getValue();
        $.publish('setCode', text);
    })

    $.subscribe('loadCode', function(o, code) {
        aceSession.setValue(code);
    });

    $.subscribe('enableCollab', function() {
         $('#collab-modal').modal('show');
    });

    $("#confirm-collab").click(function() {
        $.publish('confirmCollab');
    });

    $.subscribe('startSession', function(data) {
        $('#disable-collab').show();
        $('#enable-collab').hide();
    });

    $.subscribe('languageUpdated', function(o, language) {
        $("#selectedLanguage").html(language + "<span class='caret'>");
    });

    $.subscribe('languageUpdated', function(o, language) {
        switch (language) {
            case "Java":
                aceSession.setMode("ace/mode/java");
                break;
            case "Python":
                aceSession.setMode("ace/mode/python");
                break;
            case "Javascript":
                aceSession.setMode("ace/mode/javascript");
                break;
        };
    });

    $.subscribe('runSnippet', function() {
        spinner.spin();
        $( "#output" ).val("");
    })

    $.subscribe('runResult', function(o, data) {
        spinner.stop();
        $( "#output" ).val(data.output);
    });

    $.subscribe('newMessage', function(o, data) {
        console.log(data);
        var name    = data.name;
        var message = data.message;

        printMessage(name, message);
    });

    $.subscribe('messageSent', function(o, data) {
        var name = data.name;
        var message = data.message;

        printMessage(name, message);
        $('#message').val("");
    });

    $.subscribe('startSession', function(o, data) {
        $('#enable-collab').hide();
        $('#disable-collab').show();

        showChat();
    });

    $.subscribe('joinSession', function(o, sessionId) {
        showChat();
    })

    $.subscribe('finalize', function(o, state) {
        var owner        = state.owner;
        var userId       = state.userId;
        var snippetId    = state.snippetId;
        var sessionId    = state.sessionId;
        var sessionOwner = state.sessionOwner;
        var snippetName  = state.snippetName;
        var tags         = state.tags;

        if (tags != null) { 
            for (var i = 0; i < tags.length; i++) {
                var t = tags[i];

                $('#tags').tagit('createTag', t);
            }
        }

        if(sessionId == null) {
            $('#enable-collab').show();
        }

        if(sessionOwner == userId && userId != null) {
            $('#disable-collab').show();
        }

        if(!snippetId || (userId != null && owner == userId)) {
            $('#save').show();

            if(snippetId) {
                $('#info').show();
            }
        }

        if(snippetId != null) {
            $('#menu1').show();
            $('#fork').show();
        }

        $('#share').val(host + snippetId);
        $('#snippetName').val(snippetName);

        $('#load').hide();
    });

    $.subscribe('requestDisplayName', function() {
        $('#displayname-modal').modal('show');
    })

    $("#share:text").click(function() { 
        $(this).select(); 
    });

    $('#message').keyup(function(e) {
        if(e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });

    $('.ace_text-input').addClass('mousetrap');

    /* ***********************************************/
    /* Helper Functions                              */
    /* ***********************************************/

    function printMessage(name, message) {
        $('#chatbox').val( $('#chatbox').val() + name + ": " + message + '\n');
    }

    function openDocument(docId, text) {
        var options = {
            origin: host + "channel",
        };

        sharejs.open(docId, 'text', options, function(error, doc) {
            doc.attach_ace(editor);

            if(text) {
                editor.setValue(text, -1);
            }
        });
    }

    function finalize() {

        var snippetId = window.id;
        state.snippetId = snippetId;

        $.when(

            $.get('/snippet/get/' + snippetId, function(data) {
                var displayName = data.displayName;
                var language    = data.language;
                var code        = data.code;
                var owner       = data.owner;
                var snippetName = data.name;
                var tags        = data.tags;

                if(displayName) {
                    $.publish('setDisplayName', displayName);
                }

                if(snippetName) {
                    $.publish('setSnippetName', snippetName);
                }

                if(language) {
                    $.publish('setLanguage', language);
                }

                if(code) {
                    $.publish('setCode', code);
                }

                if(owner) {
                    $.publish('setOwner', owner);
                }

                if(tags) {
                    $.publish('setTags', {
                        tags: tags,
                    });
                }
            }),

            $.get('/user/get/', function(data) {
                var userId = data.id;
                var username = data.username;

                if (userId) {
                    $.publish('setUserId', userId);
                }

                if (username) {
                    $.publish('setUsername', username);
                }
            }),

            $.get('/session/get/' + snippetId, function(data) {
                var sessionId = data.id;
                var sessionOwner = data.owner;

                if(sessionId) {
                    $.publish('setSessionId', sessionId);
                }

                if(sessionOwner) {
                    $.publish('setSessionOwner', sessionOwner);
                }
            })


        ).then(function() {
            $.publish('finalize', state);
        });

    }

    finalize();

});