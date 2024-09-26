import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import { NotFoundError, currentUser, errorHandler } from "@semiheimerco/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/list";
import { updateTicketRouter } from "./routes/update";

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError("Route not available");
});
app.use(errorHandler);

export { app };
