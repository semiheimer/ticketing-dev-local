import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestValidationError } from "../errors/custom-errors";
import { CustomError } from "../errors/custom-error";
import { Error as MongooseError } from "mongoose";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  if (
    err instanceof MongooseError.ValidationError ||
    err instanceof MongooseError.CastError
  ) {
    statusCode = 400;
  } else if (err instanceof MongooseError.DocumentNotFoundError) {
    statusCode = 404;
  } else if (err instanceof MongooseError.MongooseServerSelectionError) {
    statusCode = 503;
  }
  const errorResponse = {
    isError: true,
    errors:
      err instanceof RequestValidationError
        ? err.serializeErrors()
        : [{ message: err.message }],
    body: req.body,
  };

  return res.status(statusCode).send(errorResponse);
};
