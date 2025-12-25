const socket = require("socket.io");
// This module initializes a WebSocket server using Socket.IO.
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  // This function is called when a new client connects to the WebSocket server.

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle incoming messages from the client(Event handlers)
    socket.on("joinChat", () => {
      console.log("Client joined chat");
    });
    socket.on("sendMessage", () => {
      console.log("Message received from client");
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    // You can add more event listeners here
  });
};

module.exports = initializeSocket;
