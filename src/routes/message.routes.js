import express from "express";
import {
  sendMessage,
  getAllMessages,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/users.auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, sendMessage); // Send a message
router.get("/:chatId", verifyJWT, getAllMessages); // Get all messages for a chat

export default router;
