import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";
import AuthService from "./auth.service";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";

@injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as LoginDTO;
      const result = await this.authService.login(body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as RegisterDTO;
      const result = await this.authService.register(body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
