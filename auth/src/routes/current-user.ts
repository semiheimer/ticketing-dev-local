import express from "express";
import authController from "../controllers/auth.controller";
import { currentUser } from "@semiheimerco/common";

const router = express.Router();
router.get("/api/users/currentuser", currentUser, authController.currentUser);

export { router as currentUserRouter };
