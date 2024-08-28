import { JWT } from "@semiheimerco/common";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

declare global {
  function signin(): Promise<string>;
}

jest.mock("../nats-wrapper");

let mongo: any;
beforeAll(async () => {
  process.env.ACCESS_KEY = "asdfasdf";
  process.env.ACCESS_JWT_EXPIRES_IN = "3d";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  } else {
    throw new Error("Database connection is not established.");
  }


});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  const token = JWT.createAccessJWT(payload);
  const cookie = `session=${token}`;
  return cookie;
};

