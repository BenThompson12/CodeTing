function deleteSnippet(id) {
    snippet.delete(id, function(data) {
        location.reload();
    });
}