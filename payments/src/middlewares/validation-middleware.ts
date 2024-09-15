import { body } from "express-validator";
import { BadRequestError, withValidationErrors } from "@semiheimerco/common";
import mongoose from "mongoose";

export const validateRequest = withValidationErrors([
  // body("token").notEmpty().withMessage("token is required"),
  body("orderId").not().isEmpty(),
  body("orderId").custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError("invalid order id");
  }),
]);
