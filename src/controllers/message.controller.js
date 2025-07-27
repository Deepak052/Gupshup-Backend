import {asyncHandler} from "../utils/asyncHandler.js";
import {
  sendMessageService,
  getAllMessagesService,
} from "../services/message.service.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const message = await sendMessageService({
    senderId: req.user._id,
    content,
    chatId,
  });

  res.status(201).json({ success: true, message });
});

export const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await getAllMessagesService(req.params.chatId);
  res.status(200).json({ success: true, messages });
});
