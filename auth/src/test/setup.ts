import { MongoMemoryServer } from "mongodb-memory-server-core";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
let mongo: MongoMemoryServer;

//for test files
//! 1.yol
declare global {
  namespace globalThis {
    function getCookie(): Promise<string[]>;
  }
}

//! 2.yol
// declare global {
//   var getCookie: () => Promise<string[]>;
// }

// ! 3.yol
// declare global {
//   namespace globalThis {
//     var getCookie: () => Promise<string[]>;
//   }
// }

//! 4.yol
// declare global {
//   function getCookie(): Promise<string[]>;
// }

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

const userData = {
  email: "test06@gmail.com",
  password: "1234567",
  username: "test06",
  firstname: "findname",
  lastname: "lastname6",
};

global.getCookie = async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send(userData)
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
