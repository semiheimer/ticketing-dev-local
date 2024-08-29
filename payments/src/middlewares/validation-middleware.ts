import { body } from "express-validator";
import { withValidationErrors } from "@semiheimerco/common";

export const validateRequest = withValidationErrors([
  body("token").not().isEmpty(),
  body("orderId").not().isEmpty(),
]);
