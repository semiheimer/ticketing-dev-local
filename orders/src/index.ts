import mongoose from "mongoose";
import { app } from "./app";
import { natsConnection } from "./nats-connection";

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  await natsConnection();
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!!!");
  });
}

startServer();

