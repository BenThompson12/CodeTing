$(document).ready(function() {
    $(window).on('resize', function(){
        resizeEditor();
        resizeOutput(); 
    });

    function getWorkingHeight() {
        return $(window).height() - $('#navbar').height() - 10;
    }

    function resizeEditor() {
        $("#editor").height(getWorkingHeight());
    }

    function resizeOutput() {
        var chatHeight = $("#chatContainer").is(":visible") ? $("#chatContainer").height() : 0;
        $("#outputContainer").height(getWorkingHeight() - chatHeight + 5);
    }

    window.hideChat = function showChat() {
        $("#chatContainer").hide()

        resizeOutput();
    }

    window.showChat = function showChat() {
        $("#chatContainer").show()

        resizeOutput();
    }

    // Trigger resize on page load begin dynamic resizing
    $(window).trigger('resize');
});