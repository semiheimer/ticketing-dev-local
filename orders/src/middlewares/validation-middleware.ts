import { withValidationErrors } from "@semiheimerco/common";
import { body } from "express-validator";
import mongoose from "mongoose";

export const validateNewOrder = withValidationErrors([
  body("ticketId")
    // .notEmpty()
    // .withMessage("ticketId must be provided")
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("invalid ticketId"),
  // body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")
]);

export const validateUpdateTicket = withValidationErrors([
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 6 }),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be provided and must be greater than 0"),
]);
