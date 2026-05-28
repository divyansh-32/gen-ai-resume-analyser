import { CustomRequest } from "../types/customRequest";
import { Response } from "express";
import aiService from "../services/aiService";

const fileUploadController = {
    uploadFileWithJD: async (req: CustomRequest, res: Response) => {
        try {
            const jd = req.body?.jd; 
            const file = req.file;

            if (!jd || !file) {
                return res.status(400).json({
                    message: "JD and file are required",
                });
            }

            const analysis = await aiService.analyzeResume(file.path, jd);
            // 🔥 next step: parse resume + AI processing
            res.status(200).json({
                message: "File uploaded successfully and analysis is done",
                fileName: file.filename,
                analysis
            });
        } catch (error) {
            res.status(500).json({
                message: "Upload/Resume Analysis failed",
                error: error instanceof Error ? error.message : "Unknown error",
            });
            console.error("Error uploading file:", error);
        }
    },
}

export default fileUploadController;