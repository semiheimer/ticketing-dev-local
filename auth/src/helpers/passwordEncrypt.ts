import { pbkdf2Sync } from "node:crypto";

const keyCode = process.env.JWT_KEY;
const loopCount = 1000;
const charCount = 32;
const encType = "sha512";

export class PasswordEncrypt {
  static toHash(password: string) {
    try {
      if (!keyCode) {
        throw new Error("Environment variable JWT_KEY is not set");
      }
      const hashedPassword = pbkdf2Sync(
        password,
        keyCode,
        loopCount,
        charCount,
        encType,
      ).toString("hex");
      return hashedPassword;
    } catch (error: any) {
      console.error("Error in PasswordEncrypt.toHash:", error.message);
      throw error;
    }
  }
}
