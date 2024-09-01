import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import path from "path";
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
jest.setTimeout(130000);
beforeAll(async () => {
  mongo = await MongoMemoryServer.create({
    binary: {
      version: "7.0.6", // İndirdiğiniz MongoDB sürümü
      downloadDir: path.resolve(__dirname, "mongodb"), // Binary dosyalarını koyduğunuz dizin
    },
  });
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
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
  await mongoose.disconnect();
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
