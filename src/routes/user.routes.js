// routes/user.route.js
import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import * as UserValidation from "../validations/users.validation.js";
import validate from "../middlewares/validate.js";
import { verifyJWT } from "../middlewares/users.auth.middleware.js";

const router = Router();

// get all users
router.get("/get-all-users",verifyJWT, UserController.getAllUsersController);

//get user by id
router.get("/get-user/:id",verifyJWT,UserController.getUserByIdController);

// update user profile
router.put("/profile", verifyJWT, UserController.updateUserProfileController);

// update user settings
router.put("/settings", verifyJWT, UserController.updateUserSettingsController);

// block, unblock, report
router.post("/block", verifyJWT, UserController.blockUserController);
router.post("/unblock", verifyJWT, UserController.unblockUserController);
router.post("/report", verifyJWT, UserController.reportUserController);

export default router;
