import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      default: null,
      index: true,
    },
    phone: {
      type: String,
      unique: true,
      default: null,
      index: true,
    },
    gender: {
      type: String,
      enum: ["", "Male", "Female", "Other"],
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    facebookId: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      default: "",
    },
    otp: {
      code: {
        type: Number,
        default: null,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
    },
    addresses: [
      {
        area: {
          type: String,
          default: null,
        },
        landmark: {
          type: String,
          default: null,
        },
        addressTitle: {
          type: String,
          default: null,
        },
        addressType: {
          type: String,
          default: "",
        },
        zipCode: {
          type: String,
          default: null,
        },
      },
    ],
    fcmToken: {
      type: String,
      default: "",
    },
    referCode: {
      type: String,
      unique: true,
    },
    loggedInDevice: {
      type: String,
      default: "",
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deviceId: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active",
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { collection: "User", timestamps: true }
);

userSchema.index({ firstName: 1, email: 1, phone: 1 });

async function generateUniqueReferCode() {
  let referCode;
  let codeExists = true;
  while (codeExists) {
    referCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    codeExists = await User.exists({ referCode });
  }
  return referCode;
}

userSchema.pre("save", async function (next) {
  if (!this.referCode) {
    try {
      this.referCode = await generateUniqueReferCode();
    } catch (error) {
      return next(error);
    }
  }
  next();
});

function excludeDeleted(next) {
  this.where({ isDeleted: { $ne: true } });
  next();
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

userSchema.pre("find", excludeDeleted);
userSchema.pre("findOne", excludeDeleted);
userSchema.pre("findOneAndUpdate", excludeDeleted);
userSchema.pre("findById", excludeDeleted);
userSchema.pre("countDocuments", excludeDeleted);

export const User = mongoose.model("User", userSchema);
