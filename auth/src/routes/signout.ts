import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();
router.post("/api/users/signout", authController.signout);

export { router as signoutUserRouter };
