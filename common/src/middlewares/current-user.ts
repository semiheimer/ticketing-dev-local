import { NextFunction, Request, Response } from "express";
import { UserPayload } from "../types";
import { JWT } from "../helpers/jwtHelpers";
import { TokenExpiredError } from "jsonwebtoken";

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { session } = req.cookies;
  req.currentUser = null;

  if (!session) return next();

  try {
    const payload = JWT.verifyAccessJWT(session) as UserPayload;
    req.currentUser = payload;
  } catch (error) {
    res.clearCookie("session", {
      httpOnly: false,
      secure: process.env.NODE_ENV !== "development",
    });

    if (error instanceof TokenExpiredError) {
      console.error("JWT expired");
    } else {
      console.error("JWT verification error");
    }
  }
  next();
};
