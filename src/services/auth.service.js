import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import httpStatus from "http-status";

// Send OTP for LOGIN (user must exist)
const sendOtpForLogin = async (phone) => {
  const user = await User.findOne({ phone });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");

  const otp = Math.floor(100000 + Math.random() * 900000); // Random 6-digit OTP
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  user.otp = { code: otp, expiresAt };
  await user.save();

  // TODO: Integrate with SMS service to send OTP
  console.log(`OTP for ${phone}: ${otp}`); // For testing, log OTP (remove in production)
  return {};
};

// Send OTP for SIGNUP (user must NOT exist)
const sendOtpForSignup = async ({
  phone,
  firstName,
  lastName,
  email,
  gender,
  referredBy,
}) => {
  let user = await User.findOne({ phone });
  if (user) throw new ApiError(httpStatus.CONFLICT, "User already exists");

  const otp = Math.floor(100000 + Math.random() * 900000); // Random 6-digit OTP
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  user = new User({
    phone,
    firstName,
    lastName,
    email: email || null,
    gender: gender || "",
    referredBy: referredBy || null,
    otp: { code: otp, expiresAt },
  });
  await user.save();

  // TODO: Integrate with SMS service to send OTP
  console.log(`OTP for ${phone}: ${otp}`); // For testing, log OTP (remove in production)
  return {};
};

// Verify OTP for LOGIN
const verifyOtpAndLogin = async ({ phone, otp, fcmToken, deviceId }) => {
  const user = await User.findOne({ phone });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  const { code, expiresAt } = user.otp || {};
  if (!code || code !== Number(otp))
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid OTP");
  if (expiresAt < new Date())
    throw new ApiError(httpStatus.UNAUTHORIZED, "OTP expired");

  if (fcmToken) user.fcmToken = fcmToken;
  if (deviceId) user.deviceId = deviceId;

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  user.otp = { code: null, expiresAt: null }; // Clear OTP
  await user.save();

  const userData = await User.findById(user._id).select(
    "-otp -refreshToken -accessToken"
  );
  return { ...userData.toObject(), accessToken, refreshToken };
};

// Signup after verifying OTP
const userSignup = async ({ phone, otp, fcmToken, deviceId }) => {
  const user = await User.findOne({ phone });
  if (!user)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "OTP not requested or user does not exist"
    );

  const { code, expiresAt } = user.otp || {};
  if (!code || code !== Number(otp))
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid OTP");
  if (expiresAt < new Date())
    throw new ApiError(httpStatus.UNAUTHORIZED, "OTP expired");

  if (fcmToken) user.fcmToken = fcmToken;
  if (deviceId) user.deviceId = deviceId;

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  user.otp = { code: null, expiresAt: null }; // Clear OTP
  await user.save();

  const userData = await User.findById(user._id).select(
    "-otp -refreshToken -accessToken"
  );
  return { ...userData.toObject(), accessToken, refreshToken };
};

// Logout service
const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  user.accessToken = null;
  user.refreshToken = null;
  user.fcmToken = "";
  user.deviceId = "";
  user.otp = { code: null, expiresAt: null };
  await user.save();
  return true;
};

// Get all users
const getAllUsers = async () => {
  const users = await User.find().select("firstName lastName avatar _id");
  if (!users || users.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found");
  }
  return users;
};

// Update user
const updateUser = async (updateData, userId) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

export {
  sendOtpForLogin,
  sendOtpForSignup,
  verifyOtpAndLogin,
  userSignup,
  logoutUser,
  getAllUsers,
};
