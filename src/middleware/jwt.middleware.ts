import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { ApiError } from "../utils/api-error";
import { Role } from "@prisma/client";

export interface JwtPayload {
  id: number;
  role: Role;
}

export class JwtMiddleware {
  verifyToken = (secretKey: string) => {
    return (req: Request, _res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new ApiError("No token provided", 401);
      }

      jwt.verify(token, secretKey, (err, payload) => {
        if (err) {
          if (err instanceof TokenExpiredError) {
            throw new ApiError("Token expired", 403);
          } else {
            throw new ApiError("Invalid token", 403);
          }
        }

        req.user = payload as JwtPayload;
        next();
      });
    };
  };
}
