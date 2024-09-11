import express from "express";
import authController from "../controllers/auth.controller";
import { requireAuth } from "@semiheimerco/common";

const router = express.Router();
router.post("/api/users", requireAuth, authController.list);

export { router as signinUserRouter };
