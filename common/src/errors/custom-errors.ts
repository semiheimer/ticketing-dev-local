import { StatusCodes } from "http-status-codes";
import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  readonly statusCode = StatusCodes.NOT_FOUND;
  readonly name = "NotFoundError";
  constructor(message: string = "Not Found") {
    super(message);
    // Object.setPrototypeOf(this, new.target.prototype);
    // Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
export class BadRequestError extends CustomError {
  readonly name = "BadRequestError";
  readonly statusCode = StatusCodes.BAD_REQUEST;
  constructor(message: string = "Bad Request") {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  readonly statusCode = StatusCodes.UNAUTHORIZED;
  readonly name = "Unauthorized";
  constructor(message: string = "Not authorized") {
    super(message);
  }
}

export class ForbiddenError extends CustomError {
  readonly statusCode = StatusCodes.FORBIDDEN;
  readonly name = "Forbidden";
  constructor(message: string = "This route is forbidden") {
    super(message);
  }
}

export class ConflictError extends CustomError {
  readonly statusCode = StatusCodes.CONFLICT;
  readonly name = "Conflict";
  constructor(message: string = "There is a conflict in the resource") {
    super(message);
  }
}

export class DatabaseConnectionError extends CustomError {
  readonly statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  readonly name = "DatabaseConnectionError";
  constructor(message: string = "Not connected to database") {
    super(message);
  }
}

export class RequestValidationError extends CustomError {
  readonly statusCode = StatusCodes.BAD_REQUEST;
  readonly name = "RequestValidationError";
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");
  }
  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === "field") {
        return { message: err.msg, field: err.path };
      } else {
        return { message: err.msg };
      }
    });
  }
}
