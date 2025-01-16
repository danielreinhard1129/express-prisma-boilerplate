import { Router } from "express";
import { validateBody } from "../../middleware/validation.middleware";
import { AuthController } from "./auth.controller";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router.post(
      "/login",
      validateBody(LoginDTO),
      this.authController.login,
    );
    this.router.post(
      "/register",
      validateBody(RegisterDTO),
      this.authController.register,
    );
  };

  getRouter(): Router {
    return this.router;
  }
}
