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
