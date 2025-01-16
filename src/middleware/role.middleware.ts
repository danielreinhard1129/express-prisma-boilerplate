import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";

export const verifyRole = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      throw new ApiError("Forbidden", 403);
    }

    next();
  };
};
