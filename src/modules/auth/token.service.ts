import jwt, { SignOptions } from "jsonwebtoken";

export class TokenService {
  generateToken = (
    payload: object,
    secretKey: string,
    options?: SignOptions,
  ): string => {
    return jwt.sign(payload, secretKey, {
      expiresIn: "2h",
      ...options,
    });
  };
}
