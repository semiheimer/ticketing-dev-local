import { Request, Response, NextFunction } from "express";
import { param, validationResult, ValidationChain } from "express-validator";
import {
  BadRequestError,
  RequestValidationError,
} from "../errors/custom-errors";
import mongoose from "mongoose";

type ValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

type ValidationFunction = (
  validateValues: ValidationChain[],
) => [ValidationChain[], ValidationMiddleware];

export const withValidationErrors: ValidationFunction = (
  validateValues: ValidationChain[],
) => {
  const middleware: ValidationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // const errorMessages = errors.array().map((error) => error.msg);
      throw new RequestValidationError(errors.array());
    }
    next();
  };

  return [validateValues, middleware];
};

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError("invalid MongoDB id");
  }),
]);
