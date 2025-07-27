import { Router } from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js"


const router = Router();

//auth routes
router.use("/",authRouter);

// Mount the userRouter at /users
router.use("/", userRouter);




export default router;
