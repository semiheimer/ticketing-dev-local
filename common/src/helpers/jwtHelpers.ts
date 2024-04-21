import jwt, { Secret } from "jsonwebtoken";
import { UserPayload } from "../types";
export class JWT {
  private static getSecretKeyAndExpiry(keyName: string): {
    secretKey: Secret;
    expiresIn: string;
  } {
    const envVar = process.env[`${keyName}_KEY`];
    if (!envVar) {
      throw new Error(`${keyName} is not defined`);
    }
    const expiresIn = process.env[`${keyName}_JWT_EXPIRES_IN`];
    if (!expiresIn) {
      throw new Error(`${keyName} is not defined`);
    }
    return { secretKey: envVar as Secret, expiresIn };
  }

  static verifyAccessJWT(token: string) {
    const { secretKey } = this.getSecretKeyAndExpiry("ACCESS");
    return jwt.verify(token, secretKey) as UserPayload;
  }

  static verifyRefreshJWT(token: string) {
    const { secretKey } = this.getSecretKeyAndExpiry("REFRESH");
    return jwt.verify(token, secretKey) as UserPayload;
  }

  static createAccessJWT(payload: UserPayload): string {
    const { secretKey, expiresIn } = this.getSecretKeyAndExpiry("ACCESS");
    return jwt.sign(payload, secretKey, { expiresIn });
  }

  static createRefreshJWT(payload: UserPayload) {
    const { secretKey, expiresIn } = this.getSecretKeyAndExpiry("REFRESH");
    return jwt.sign(payload, secretKey, { expiresIn });
  }
}
