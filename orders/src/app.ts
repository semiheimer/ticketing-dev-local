import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import {
  NotFoundError,
  currentUser,
  errorHandler,
  requireAuth,
} from "@semiheimerco/common";
import { indexOrderRouter } from "./routes/list";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

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
app.use(currentUser);

app.use(requireAuth, deleteOrderRouter);
app.use(requireAuth, indexOrderRouter);
app.use(requireAuth, newOrderRouter);
app.use(requireAuth, showOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError("Route not available");
});
app.use(errorHandler);

export { app };
