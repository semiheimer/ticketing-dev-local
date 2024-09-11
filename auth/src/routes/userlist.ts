import express from "express";
import authController from "../controllers/auth.controller";
import { requireAuth } from "@semiheimerco/common";

const router = express.Router();
router.get("/api/users/list", requireAuth, authController.list);

export { router as userListRouter };
