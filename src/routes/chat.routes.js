import express from "express";
import {
  accessOrCreateChat,
  createGroupChat,
  fetchUserChats,
  getGroupChatById,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/users.auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, accessOrCreateChat); // Create or access chat
router.get("/", verifyJWT, fetchUserChats); // Get all chats for a user
router.post("/group", verifyJWT, createGroupChat); // Create group chat
router.get("/:chatId", verifyJWT, getGroupChatById); // Get group chat by ID

export default router;
