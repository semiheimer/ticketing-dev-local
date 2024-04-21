import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import { NotFoundError, currentUser, errorHandler } from "@semiheimerco/common";
import { indexOrderRouter } from "./routes/index";
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
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError("Route not available");
});
app.use(errorHandler);

export { app };

