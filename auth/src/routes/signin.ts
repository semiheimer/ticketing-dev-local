import express from "express";
import authController from "../controllers/auth.controller";
import { validateSignin } from "../middlewares/validation-middleware";

const router = express.Router();
router.post("/api/users/signin", ...validateSignin, authController.signin);

export { router as signinUserRouter };
