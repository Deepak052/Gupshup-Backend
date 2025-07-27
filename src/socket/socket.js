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

    // Join a chat room
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log(`User joined chat room: ${room}`);
    });

    // When a message is sent
    socket.on("new message", (message) => {
      const chat = message.chat;
      if (!chat?.members) return;

      chat.members.forEach((memberId) => {
        if (memberId === message.sender._id) return;
        const targetSocketId = onlineUsers.get(memberId);
        if (targetSocketId) {
          socket.to(targetSocketId).emit("message received", message);
        }
      });
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
