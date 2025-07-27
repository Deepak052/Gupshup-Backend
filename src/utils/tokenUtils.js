import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


// Generate access and refresh tokens for a given user ID
const generateUserAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// Generate access and refresh tokens for a given user ID
const generateAdminAccessAndRefreshTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = admin.generateAccessToken();

    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const generateStoreAccessAndRefreshTokens = async (storeId) => {
  try {
    const store = await Store.findById(storeId);
    if (!store) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = store.generateAccessToken();

    const refreshToken = store.generateRefreshToken();

    store.refreshToken = refreshToken;
    await store.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

export {
  generateUserAccessAndRefreshTokens,
  generateAdminAccessAndRefreshTokens,
  generateStoreAccessAndRefreshTokens,
};
