// index.js or server.js

import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import socketHandler from "./socket/socket.js"; // <-- Create this file for socket handling

dotenv.config({ path: "./.env" });

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 8000;

    // Create HTTP server from express app
    const server = http.createServer(app);

    // Initialize Socket.IO server
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173", // frontend URL
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Socket events
    socketHandler(io); // setup all your socket listeners in separate file

    // Start the server
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

startServer();
