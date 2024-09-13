import mongoose from "mongoose";
import { app } from "./app";
import { DatabaseConnectionError } from "@semiheimerco/common";
import { userSync } from "./utils/userCreate";

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.info("* Connected to MongoDB *");

    app.listen(3000, () => {
      console.log("Listening on port 3000!!");
    });
    //! productionda silinecek
    // await userSync();
  } catch (error) {
    console.error(
      error instanceof DatabaseConnectionError
        ? "* Could Not Connect to MongoDB *"
        : "Error:",
      error
    );
    process.exit(1);
  }
};

startServer();
