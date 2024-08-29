import { JWT } from "@semiheimerco/common";
import mongoose from "mongoose";

process.env.MONGOMS_DOWNLOAD_DIR = "./semihcan";
// Global declaration for the signin function
declare global {
  function signin(id?: string): Promise<string>;
}

jest.mock("../nats-wrapper");

beforeAll(async () => {
  process.env.ACCESS_KEY = "asdfasdf";
  process.env.ACCESS_JWT_EXPIRES_IN = "3d";

  await mongoose.connect("mongodb://localhost:27017/payments");
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  } else {
    throw new Error("Database connection is not established.");
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  jest.clearAllTimers();
  jest.useRealTimers();
});

global.signin = async (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  const token = JWT.createAccessJWT(payload);
  const cookie = `session=${token}`;
  return cookie; // Return a single string as per function definition
};
