import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import path from "path";
import { JWT } from "@semiheimerco/common";

//for test files
//! 1.yol
declare global {
  namespace globalThis {
    function signin(id?: string): string;
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
process.env.ACCESS_KEY = "asdfasdf";
process.env.ACCESS_JWT_EXPIRES_IN = "3d";
process.env.JWT_KEY = "thknmloy"; // sadece auth'da var

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

const userData = {
  email: "test06@gmail.com",
  password: "1234567",
  username: "test06",
  firstname: "findname",
  lastname: "lastname6",
};

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  const token = JWT.createAccessJWT(payload);
  const cookie = `session=${token}`;
  return cookie; // Return a single string as per function definition
};
