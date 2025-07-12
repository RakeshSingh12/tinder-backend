
const socket = require('socket.io');
// This module initializes a WebSocket server using Socket.IO.
const initializeSocket = (server) => {
    const io = socket( server, {
        cors: {
            origin: "http://localhost:3000",
        },
    })
    io.on("connection", (socket) => {
        console.log("New client connected");

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });

        // You can add more event listeners here
    });
}

module.exports = initializeSocket;