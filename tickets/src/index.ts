import mongoose from "mongoose";
import { app } from "./app";
import { natsConnection } from "./nats-connection";

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  await natsConnection(); //rabbitMQ, Kafka
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.info("* Connected to MongoDB *");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!!");
  });
}

startServer();

