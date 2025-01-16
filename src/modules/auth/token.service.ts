import jwt, { SignOptions } from "jsonwebtoken";

export class TokenService {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  generateToken = (payload: object, options?: SignOptions): string => {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: "2h",
      ...options,
    });
  };
}
