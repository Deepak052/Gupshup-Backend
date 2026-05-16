import httpStatus from "http-status";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as UserService from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all users (only selected fields returned by service)
export const getAllUsersController = asyncHandler(async (req, res) => {
  const users = await UserService.getAllUsersService();

  res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, users, "Users fetched successfully"));
});

// Get user by ID
export const getUserByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserService.getUserByIdService(id);

  res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, user, "User fetched successfully"));
});

export const updateUserProfileController = asyncHandler(async (req, res) => {
  const { firstName, lastName, avatar, statusMessage } = req.body;
  const userId = req.user._id;

  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (avatar) updateData.avatar = avatar;
  if (statusMessage) updateData.statusMessage = statusMessage;

  const updatedUser = await UserService.updateUserProfileService(userId, updateData);

  res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, updatedUser, "Profile updated successfully"));
});

export const updateUserSettingsController = asyncHandler(async (req, res) => {
  const { theme, notificationPreferences } = req.body;
  const userId = req.user._id;

  const settingsData = {};
  if (theme) settingsData.theme = theme;
  if (notificationPreferences) settingsData.notificationPreferences = notificationPreferences;

  const updatedUser = await UserService.updateUserSettingsService(userId, settingsData);

  res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, updatedUser, "Settings updated successfully"));
});

export const blockUserController = asyncHandler(async (req, res) => {
  const { targetUserId } = req.body;
  const userId = req.user._id;

  await UserService.blockUserService(userId, targetUserId);
  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, null, "User blocked successfully"));
});

export const unblockUserController = asyncHandler(async (req, res) => {
  const { targetUserId } = req.body;
  const userId = req.user._id;

  await UserService.unblockUserService(userId, targetUserId);
  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, null, "User unblocked successfully"));
});

export const reportUserController = asyncHandler(async (req, res) => {
  const { targetUserId } = req.body;
  const userId = req.user._id;

  await UserService.reportUserService(userId, targetUserId);
  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, null, "User reported successfully"));
});
