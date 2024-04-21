import { ValidationError } from "express-validator";
export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract name: string;
  constructor(message: string) {
    super(message);
  }
}
