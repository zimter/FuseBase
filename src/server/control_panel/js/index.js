const socket = io();

socket.emit("postConnection", "master");