import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";
import { ApiError } from "../utils/ApiError.js";
import httpStatus from "http-status";

export const sendMessageService = async ({ senderId, content, chatId }) => {
  if (!content || !chatId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid data passed");
  }

  // Validate that the chat exists and the sender is a member
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ApiError(httpStatus.NOT_FOUND, "Chat not found");
  }
  if (!chat.members.includes(senderId)) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not a member of this chat"
    );
  }

  let newMessage = await Message.create({
    sender: senderId,
    content,
    chat: chatId,
  });

  // Use await populate separately
  newMessage = await newMessage.populate([
    { path: "sender", select: "firstName lastName avatar" },
    { path: "chat" },
  ]);

  return newMessage;
};

export const getAllMessagesService = async (chatId) => {
  return Message.find({ chat: chatId })
    .populate("sender", "firstName lastName avatar")
    .populate("chat");
};
