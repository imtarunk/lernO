const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("user_connected", (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;

      // Notify others that user is online
      socket.broadcast.emit("user_online", userId);
    });

    socket.on("join_chat", (chatRoomId) => {
      socket.join(chatRoomId);
      console.log(`User ${socket.userId} joined chat room: ${chatRoomId}`);
    });

    socket.on("send_message", (data) => {
      // Broadcast message to chat room
      socket.to(data.chatRoomId).emit("receive_message", data);
    });

    socket.on("typing_start", (data) => {
      socket.to(data.chatRoomId).emit("user_typing", {
        userId: socket.userId,
        isTyping: true,
      });
    });

    socket.on("typing_stop", (data) => {
      socket.to(data.chatRoomId).emit("user_typing", {
        userId: socket.userId,
        isTyping: false,
      });
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        socket.broadcast.emit("user_offline", socket.userId);
      }
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
