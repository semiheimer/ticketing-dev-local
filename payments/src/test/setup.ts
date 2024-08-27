import { JWT } from "@semiheimerco/common";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// declare global {
//   function signin(): Promise<string>;
// }
declare global {
  var signin: (id?: string) => string[];
}
jest.mock("../nats-wrapper");

let mongo: any;

beforeAll(async () => {
  process.env.ACCESS_KEY = "asdfasdf";
  process.env.ACCESS_JWT_EXPIRES_IN = "3d";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();

  const mongoUri = mongo.getUri();
  if (mongoUri === undefined) throw new Error("['MONGO_URI'] is undefined ")

  await mongoose.connect(mongoUri, {}).catch((err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});
  

});

beforeEach(async () => {
  jest.clearAllMocks();
  await mongoose.connection.db.dropDatabase();
  // const collections = await mongoose.connection.db.collections();

  // for (let collection of collections) {
  //   await collection.deleteMany({});
  // }
});

afterAll(async () => {

  if (mongo) {
    await mongo.stop();
  }

  // await mongoose.connection.close();
  await mongoose.disconnect();
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

