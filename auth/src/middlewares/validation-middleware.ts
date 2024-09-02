import { body, ValidationChain, oneOf } from "express-validator";
import { ConflictError, withValidationErrors } from "@semiheimerco/common";
import { User } from "../models/user-model";

export const validateSignup = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters"),
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("username must be at least 6 characters"),
  body("firstname")
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .withMessage("firstname must be at least 3 characters"),
  body("email").custom(async (value, { req }) => {
    const existingUser = await User.findOne({
      $or: [{ email: value }, { username: req.body.username }],
    });
    if (existingUser) {
      throw new ConflictError("Email or username already registered");
    }
  }),
]);

export const validateSignin = withValidationErrors([
  oneOf(
    [
      body("email").notEmpty().withMessage("Email or username is required"),
      body("username").notEmpty().withMessage("Email or username is required"),
    ],
    { message: "Either email or username is required" }
  ) as ValidationChain,
  body("email")
    .optional()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("username")
    .optional()
    .notEmpty()
    .withMessage("username is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Username must be at least 6 characters"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
]);
