import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import path from "path";

// Global declaration for the signin function
declare global {
  function signin(id?: string): string;
}

jest.mock("../nats-wrapper");
let mongoDb: MongoMemoryServer;

const connect = async () => {
  try {
    mongoDb = await MongoMemoryServer.create({
      binary: {
        version: "7.0.6", // İndirdiğiniz MongoDB sürümü
        downloadDir: path.resolve(__dirname, "mongodb-memory-server"), // Binary dosyalarını koyduğunuz dizin
      },
    });
    const uri = mongoDb.getUri();
    await mongoose.connect(uri);
  } catch (error) {
    console.error("--------------------", error);
  }
};
const disConnect = async () => {
  await mongoose.disconnect();
  console.log("------------------------", mongoDb);

  await mongoDb.stop();
};
