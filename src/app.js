import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import crypto from "crypto";
import userRouter from "./routes/index.routes.js";
import messageRoutes from "./routes/message.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import logger from "./utils/logger.js";
import { ApiError } from "./utils/ApiError.js"; // (optional: for error handling)

const app = express();

// 🔐 Session Middleware
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || crypto.randomBytes(64).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// 🌐 CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Use your frontend port here!
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // required for cookies/session
  })
);

// 🧠 Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// 📝 Logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// 📦 Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRoutes); // ✅ was written as `chatRouter` but imported as `chatRoutes`
app.use("/api/v1/message", messageRoutes);

// ❌ Not Found Handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// 🔥 Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`);
  logger.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    status: err.status || 500,
  });
});

export { app };
