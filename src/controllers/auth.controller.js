import httpStatus from "http-status";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as UserService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const userLogin = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await UserService.sendOtpForLogin(email);
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, null, "OTP sent for login"));
});

export const otpVerify = asyncHandler(async (req, res) => {
  const { email, otp, fcmToken, deviceId } = req.body;
  const response = await UserService.verifyOtpAndLogin({
    email,
    otp,
    fcmToken,
    deviceId,
  });
  return res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(httpStatus.OK, response, "User logged in successfully")
    );
});

export const userSignupOtp = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, gender, referredBy } = req.body;

  if (!email || typeof email !== "string") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email must be a string");
  }
  if (!firstName) {
    throw new ApiError(httpStatus.BAD_REQUEST, "First name is required");
  }
  if (!lastName) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Last name is required");
  }

  await UserService.sendOtpForSignup({
    email,
    firstName,
    lastName,
    phone,
    gender,
    referredBy,
  });
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, null, "OTP sent for signup"));
});

export const userSignupVerify = asyncHandler(async (req, res) => {
  const { email, otp, fcmToken, deviceId } = req.body;
  const response = await UserService.userSignup({
    email,
    otp,
    fcmToken,
    deviceId,
  });
  return res
    .status(httpStatus.CREATED)
    .json(
      new ApiResponse(
        httpStatus.CREATED,
        response,
        "User signed up successfully"
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  const userId = req.user?._id; // Extracted by verifyJWT middleware
  await UserService.logoutUser(userId);
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, null, "Logged out successfully"));
});
