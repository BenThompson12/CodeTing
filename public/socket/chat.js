chat = {
	joinRoom: function(roomId) {
		socket.emit('joinRoom', {
        	roomId: roomId,
   		});
	},

	sendMessage: function(roomId, name, message) {
		socket.emit('sendMessage', {
			roomId : roomId,
			name   : name,
			message: message,
		});
	},

	onNewMessage: function(callback) {
		socket.on('newMessage', callback);
	},

};