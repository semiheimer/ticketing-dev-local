import mongoose from "mongoose";
import { app } from "./app";
import { DatabaseConnectionError } from "@semiheimerco/common";
import { userSync } from "./utils/userCreate";

if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");

try {
  app.listen(3000, () => {
    console.log("Listening on port 3000!!");
  });
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
      console.info("* Connected to MongoDB *");
      await userSync();
    })
    .catch((err) => {
      console.error("* Could Not Connected to MongoDB *\n", err);
      throw new DatabaseConnectionError();
    });
} catch (error) {
  console.error(error);
  process.exit(1);
}
