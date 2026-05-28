import { Router } from "express";
import authController from "../controllers/authController";
import authVerify from "../middlewares/authVerify";

const router = Router();

// Example route for user registration
router.post("/register", authController.register);

// Example route for user login
router.post("/login", authController.login);

// Example route for user logout
router.post("/logout", authController.logout);

router.post("/current-user", authVerify, authController.getCurrentUser);

export default router;