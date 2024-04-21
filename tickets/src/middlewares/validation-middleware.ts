import { withValidationErrors } from "@semiheimerco/common";
import { body, param } from "express-validator";
import mongoose from "mongoose";

export const validateCreateTicket = withValidationErrors([
  body("title").notEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
]);

export const validateUpdateTicket = withValidationErrors([
  param("id")
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("invalid ticketId"),
  body("title").notEmpty().withMessage("Title is required"),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be provided and must be greater than 0"),
]);
