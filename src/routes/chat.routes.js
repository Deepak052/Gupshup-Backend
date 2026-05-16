import express from "express";
import {
  accessOrCreateChat,
  createGroupChat,
  fetchUserChats,
  getGroupChatById,
  clearChat,
  deleteChat,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/users.auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, accessOrCreateChat); // Create or access chat
router.get("/", verifyJWT, fetchUserChats); // Get all chats for a user
router.post("/group", verifyJWT, createGroupChat); // Create group chat
router.get("/:chatId", verifyJWT, getGroupChatById); // Get group chat by ID

router.put("/:chatId/clear", verifyJWT, clearChat); // Clear chat for user
router.put("/:chatId/delete", verifyJWT, deleteChat); // Delete chat for user

export default router;
