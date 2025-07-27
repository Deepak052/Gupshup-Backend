import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Decode token to get payload without verifying expiration
    const decodedToken = jwt.decode(token);
    if (!decodedToken?._id) {
      throw new ApiError(401, "Invalid access token format");
    }

    // Verify token signature (but allow expired tokens for logout)
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError" && req.path.includes("/logout")) {
        // Allow expired token for logout route
      } else {
        throw new ApiError(401, error.message || "Invalid access token");
      }
    }

    const user = await User.findById(decodedToken._id).select("-refreshToken");
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
