import { Chat } from "../models/chat.model.js";
import { ApiError } from "../utils/ApiError.js";
import httpStatus from "http-status";

export const accessOrCreateChatService = async (
  loggedInUserId,
  otherUserId
) => {
  if (!otherUserId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "UserId param not sent with request"
    );
  }

  // Check if a chat already exists
  let chat = await Chat.findOne({
    isGroupChat: false,
    members: { $all: [loggedInUserId, otherUserId] },
  });

  if (chat) return chat;

  // Else create new chat
  const newChat = await Chat.create({
    members: [loggedInUserId, otherUserId],
  });

  return newChat;
};

export const createGroupChatService = async (
  loggedInUserId,
  groupName,
  users
) => {
  if (!groupName || !users || users.length < 2) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Group name and at least 2 members required"
    );
  }

  const allUsers = [...users, loggedInUserId]; // include creator

  const groupChat = await Chat.create({
    chatName: groupName,
    isGroupChat: true,
    members: allUsers,
    groupAdmin: loggedInUserId,
  });

  return groupChat;
};

export const fetchUserChatsService = async (userId) => {
  return Chat.find({ members: { $in: [userId] } })
    .populate("members", "firstName lastName email avatar")
    .sort({ updatedAt: -1 });
};

export const getGroupChatByIdService = async (chatId, userId) => {
  const chat = await Chat.findOne({
    _id: chatId,
    isGroupChat: true,
    members: { $in: [userId] },
  })
    .populate("members", "firstName lastName email avatar")
    .populate("groupAdmin", "firstName lastName email avatar");

  if (!chat) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Group chat not found or you are not a member"
    );
  }

  return chat;
};
