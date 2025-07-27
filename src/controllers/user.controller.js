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
