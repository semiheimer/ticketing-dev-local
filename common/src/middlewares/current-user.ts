import { NextFunction, Request, Response } from "express";
import { UserPayload } from "../types";
import { JWT } from "../helpers/jwtHelpers";

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { session } = req.cookies;
  if (!session) {
    req.currentUser = null;
    return next();
  }
  try {
    const payload = JWT.verifyAccessJWT(session) as UserPayload;
    req.currentUser = payload;
  } catch (error) {}
  next();
};
