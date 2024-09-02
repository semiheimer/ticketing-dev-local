import { JWT } from "@semiheimerco/common";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import path from "path";

declare global {
  function signin(): string;
}

jest.mock("../nats-wrapper");

process.env.ACCESS_KEY = "asdfasdf";
process.env.ACCESS_JWT_EXPIRES_IN = "3d";

let mongoDb: MongoMemoryServer;

const connect = async () => {
  try {
    mongoDb = await MongoMemoryServer.create({
      binary: {
        version: "7.0.6",
        downloadDir: path.resolve(__dirname, "mongodb-memory-server"),
      },
    });
    const uri = mongoDb.getUri();
    await mongoose.connect(uri, {});
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
