import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

export function validateBody(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);

    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const message = errors
        .map((error) => Object.values(error.constraints || {}).join(", "))
        .join(", ");

      res.status(400).send({ message });
      return;
    }

    next();
  };
}
