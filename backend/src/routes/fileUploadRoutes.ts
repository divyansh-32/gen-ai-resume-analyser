import { Router } from "express";
import authVerify from "../middlewares/authVerify";
import fileUploadController from "../controllers/fileUploadController";
import { upload } from "../middlewares/multerMiddleware";

const router = Router();

router.post("/upload-resume", authVerify, upload.single('file'), fileUploadController.uploadFileWithJD);

export default router;