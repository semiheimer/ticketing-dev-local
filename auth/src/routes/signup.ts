import express from "express";

import authController from "../controllers/auth.controller";
import { validateSignup } from "../middlewares/validation-middleware";

const router = express.Router();

router.post("/api/users/signup", ...validateSignup, authController.signup);

export { router as signupUserRouter };
