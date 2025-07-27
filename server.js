// import { app } from "./app.js";
// import { Server } from "socket.io";
// import http from "http";

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Allow all origins — restrict in production
//     methods: ["GET", "POST"],
//   },
// });

// // Store online users (optional enhancement)
// const onlineUsers = new Map();

// // Socket.IO logic
// io.on("connection", (socket) => {
//   console.log("✅ A user connected:", socket.id);

//   // Save connected user with userId (client should emit this after login)
//   socket.on("user-connected", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     console.log(`User ${userId} is online`);
//   });

//   // Receive and broadcast messages
//   socket.on("send-message", ({ senderId, receiverId, message }) => {
//     const receiverSocketId = onlineUsers.get(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("receive-message", {
//         senderId,
//         message,
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//     for (let [userId, socketId] of onlineUsers.entries()) {
//       if (socketId === socket.id) {
//         onlineUsers.delete(userId);
//         break;
//       }
//     }
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
