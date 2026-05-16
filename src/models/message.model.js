import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    attachments: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "document", "audio", "video"], default: "image" },
        name: { type: String },
      },
    ],
    isStarredBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
