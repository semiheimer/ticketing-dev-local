import mongoose from "mongoose";
import { app } from "./app";
import { DatabaseConnectionError } from "@semiheimerco/common";

if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");

try {
  app.listen(3000, () => {
    console.log("Listening on port 3000!!");
  });
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.info("* Connected to MongoDB *"))
    .catch((err) => {
      console.error("* Could Not Connected to MongoDB *\n", err);
      throw new DatabaseConnectionError();
    });
  require("./utils/userCreate")();
} catch (error) {
  console.error(error);
  process.exit(1);
}
