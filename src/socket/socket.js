// /socket/socket.js
let onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New socket connected:", socket.id);

    // Join user to socket with their userId
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      onlineUsers.set(userData._id, socket.id);
      io.emit("online-users", Array.from(onlineUsers.keys())); // broadcast
      socket.emit("connected");
    });

    // When a message is sent
    socket.on("send-message", (data) => {
      const { chatId, message } = data;
      // Broadcast to everyone else in the chat room
      socket.in(chatId).emit("receive-message", { chatId, message });
    });

    // Join a chat room
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log(`User joined chat room: ${room}`);
    });

    // WebRTC Signaling Events
    socket.on("call-user", (data) => {
      const targetSocketId = onlineUsers.get(data.userToCall);
      if (targetSocketId) {
        socket.to(targetSocketId).emit("call-made", {
          offer: data.offer,
          socketId: socket.id, // Caller's socket ID
          callerId: data.callerId, // The user ID of the caller
          chatId: data.chatId
        });
      }
    });

    socket.on("make-answer", (data) => {
      socket.to(data.to).emit("answer-made", {
        socketId: socket.id,
        answer: data.answer
      });
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.to).emit("ice-candidate-received", {
        socketId: socket.id,
        candidate: data.candidate
      });
    });

    socket.on("end-call", (data) => {
      if (data.to) {
        socket.to(data.to).emit("call-ended");
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("🔴 Socket disconnected:", socket.id);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });
};

export default socketHandler;
