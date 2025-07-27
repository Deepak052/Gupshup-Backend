import Joi from "joi";

// Import custom validation functions if needed
import { objectId, customJoi } from "./custom.validation.js";

const userLogin = {
  body: Joi.object().keys({
    phone: Joi.number().required().messages({
      "string.base": "phone number must be a string",
      "string.empty": "phone number is required",
      "any.required": "phone number is required",
    }),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    phone: Joi.string().required().messages({
      "string.base": "phone number must be a string",
      "string.empty": "phone number is required",
      "any.required": "phone number is required",
    }),
    fcmToken: Joi.string().required().messages({
      "string.base": "FCM Token must be a string",
      "string.empty": "FCM Token is required",
      "any.required": "FCM Token is required",
    }),
    otp: Joi.number().required().messages({
      "string.base": "OTP must be a string",
      "string.empty": "OTP is required",
      "any.required": "OTP is required",
    }),
    deviceId: Joi.string().optional().messages({
      "string.base": "Device ID must be a string",
    }),
  }),
};

const resendOtp = {
  body: Joi.object().keys({
    phone: Joi.number().required().messages({
      "string.base": "phone number must be a string",
      "string.empty": "phone number is required",
      "any.required": "phone number is required",
    }),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    firstName: Joi.string().required().messages({
      "string.base": "First name must be a string",
      "string.empty": "First name is required",
      "any.required": "First name is required",
    }),
    lastName: Joi.string().required().messages({
      "string.base": "Last name must be a string",
      "string.empty": "Last name is required",
      "any.required": "Last name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
    gender: Joi.string().valid("Male", "Female", "Other").required().messages({
      "string.base": "Gender must be a string",
      "any.only": "Gender must be one of the following: Male, Female",
      "string.empty": "Gender is required",
      "any.required": "Gender is required",
    }),
  }),
};

const addAddress = {
  body: Joi.object().keys({
    area: Joi.string().required().label("Area"),
    landmark: Joi.string().required().label("Landmark"),
    addressTitle: Joi.string().required().label("Address Title"),
    addressType: Joi.string().required().label("Address Type"),
    zipCode: Joi.string()
      .pattern(/^[0-9]{5,6}$/)
      .required()
      .label("Zip Code"),
  }),
};

const updateAddress = {
  body: Joi.object().keys({
    area: Joi.string().required().label("Area"),
    landmark: Joi.string().required().label("Landmark"),
    addressTitle: Joi.string().required().label("Address Title"),
    addressType: Joi.string().required().label("Address Type"),
    zipCode: Joi.string()
      .pattern(/^[0-9]{5,6}$/)
      .required()
      .label("Zip Code"),
  }),
};

const deleteAddress = {
  params: Joi.object().keys({
    addressId: Joi.string().hex().length(24).required(),
  }),
};

export {
  userLogin,
  verifyOtp,
  resendOtp,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
};
