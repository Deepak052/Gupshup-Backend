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

export default router;
