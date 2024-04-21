import "express-async-errors";
import express from "express";
import { currentUserRouter } from "./routes/current-user";
import { signinUserRouter } from "./routes/signin";
import { signoutUserRouter } from "./routes/signout";
import { signupUserRouter } from "./routes/signup";
import cookieParser from "cookie-parser";
import { NotFoundError, errorHandler } from "@semiheimerco/common";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());

// app.use(
//   cookieSession({
//     signed: false,
//     //secure: true, // for https
//     secure: process.env.NODE_ENV !== "development",
//     maxAge: 24 * 60 * 60 * 1000,
//     httpOnly: false,
//   }),
// );

app.use(currentUserRouter);
app.use(signinUserRouter);
app.use(signoutUserRouter);
app.use(signupUserRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError("Route not available");
});
app.use(errorHandler);

export { app };

