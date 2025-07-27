import { asyncHandler } from "../utils/asyncHandler.js";
import {
  accessOrCreateChatService,
  createGroupChatService,
  fetchUserChatsService,
  getGroupChatByIdService,
} from "../services/chat.service.js";

export const accessOrCreateChat = asyncHandler(async (req, res) => {
  const chat = await accessOrCreateChatService(req.user._id, req.body.userId);
  res.status(200).json({ success: true, chat });
});

export const fetchUserChats = asyncHandler(async (req, res) => {
  const chats = await fetchUserChatsService(req.user._id);
  res.status(200).json({ success: true, chats });
});

export const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  const group = await createGroupChatService(req.user._id, name, users);
  res.status(201).json({ success: true, group });
});

export const getGroupChatById = asyncHandler(async (req, res) => {
  const chat = await getGroupChatByIdService(req.params.chatId, req.user._id);
  res.status(200).json({ success: true, chat });
});
