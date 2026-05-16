import { Router } from "express";
import { uploadFile } from "../controllers/upload.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/users.auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, upload.single("file"), uploadFile);

export default router;
