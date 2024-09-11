import { Request, Response } from "express";
import { User } from "../models/user-model";
import { StatusCodes } from "http-status-codes";
import { USER_ROLE } from "../utils/constants";
import { JWT, UnauthorizedError } from "@semiheimerco/common";

const authController = {
  list: async (req: Request, res: Response) => {
    if (!req!.currentUser?.isSuperadmin) {
      throw new UnauthorizedError("Permission is denied");
    }
    const users = await User.find();

    res.status(StatusCodes.OK).send(users);
  },

  signup: async (req: Request, res: Response) => {
    const isFirstAccount = (await User.countDocuments()) === 0;
    const role: USER_ROLE = isFirstAccount
      ? USER_ROLE.SUPERADMIN
      : USER_ROLE.USER;

    const { email, username, password, firstname, lastname } = req.body;
    const user = await User.build({
      email,
      username,
      password,
      firstname,
      lastname,
      role,
    });

    await user.save();

    const token = JWT.createAccessJWT({ id: user.id, email: user.email });

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie("session", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(StatusCodes.CREATED).send(user);
  },

  signin: async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email }],
      password,
    });

    if (!user) throw new UnauthorizedError("Invalid credentials");

    if (!user.isActive)
      throw new UnauthorizedError("This account is not active");

    const token = JWT.createAccessJWT({ id: user.id, email: user.email });

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie("session", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(StatusCodes.OK).send(user);
  },

  currentUser: (req: Request, res: Response) => {
    const { session } = req.cookies;
    res.status(StatusCodes.OK).send({ currentUser: req.currentUser || null });
  },

  signout: (req: Request, res: Response) => {
    res.cookie("session", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(StatusCodes.OK).send({ msg: "user logged out!" });
  },
};

export default authController;
