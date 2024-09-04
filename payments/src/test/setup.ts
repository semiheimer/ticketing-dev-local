import { JWT } from "@semiheimerco/common";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import path from "path";

// Global declaration for the signin function
declare global {
  function signin(id?: string): string;
}

process.env.ACCESS_KEY = "asdfasdf";
process.env.ACCESS_JWT_EXPIRES_IN = "3d";
process.env.STRIPE_KEY =
  "sk_test_51LXhToAETTjhE7o2xZ00vfMdPLOxCv07614ccSQrHTNliKVXRD5MxNuq2vNrg1Ce61JeDy2ROPYBXLPpN7ik87Do00EErt2zyd";
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
  await mongoose?.disconnect();
  await mongoDb?.stop();
};

beforeAll(connect);

beforeEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  } else {
    throw new Error("Database connection is not established.");
  }
});

afterAll(disConnect);

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  const token = JWT.createAccessJWT(payload);
  const cookie = `session=${token}`;
  return cookie; // Return a single string as per function definition
};
