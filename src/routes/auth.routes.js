import { Router } from "express";
import * as UserController from "../controllers/auth.controller.js";
import * as UserValidation from "../validations/users.validation.js";
import validate from "../middlewares/validate.js";
import { verifyJWT } from "../middlewares/users.auth.middleware.js";

const router = Router();

// Send OTP for Signup
router.post(
  "/signup",
  validate(UserValidation.userSignup),
  UserController.userSignupOtp
);

// Verify Signup OTP
router.post(
  "/signup-verify",
  validate(UserValidation.userSignupVerify),
  UserController.userSignupVerify
);

// Send OTP for Login
router.post(
  "/login",
  validate(UserValidation.userLogin),
  UserController.userLogin
);

// Verify Login OTP
router.post(
  "/verify_otp",
  validate(UserValidation.verifyOtp),
  UserController.otpVerify
);

// Logout
router.post("/logout", verifyJWT, UserController.logout);

export default router;
