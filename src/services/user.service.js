import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import httpStatus from "http-status";

//get all users
export const getAllUsersService = async () => {
  const users = await User.find().select("firstName lastName avatar _id");

  if (!users || users.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user found");
  }

  return users;
};

//get user by id
export const getUserByIdService=async(id)=>{
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user ID format");
  }

const user = await User.findById(id).select("firstName lastName avatar _id");

if(!user){
  throw new ApiError(httpStatus.NOT_FOUND,"user not found")
}
return user;
}

export const updateUserProfileService = async (userId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user ID format");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  ).select("-otp -refreshToken -accessToken");

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

export const updateUserSettingsService = async (userId, settingsData) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user ID format");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: settingsData },
    { new: true }
  ).select("-otp -refreshToken -accessToken");

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

export const blockUserService = async (userId, targetUserId) => {
  if (userId.toString() === targetUserId.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You cannot block yourself");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { blockedUsers: targetUserId } },
    { new: true }
  );
  return user;
};

export const unblockUserService = async (userId, targetUserId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { blockedUsers: targetUserId } },
    { new: true }
  );
  return user;
};

export const reportUserService = async (userId, targetUserId) => {
  if (userId.toString() === targetUserId.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You cannot report yourself");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { reportedUsers: targetUserId } },
    { new: true }
  );
  return user;
};
