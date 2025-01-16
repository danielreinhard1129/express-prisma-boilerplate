import cors from "cors";
import express, { json } from "express";
import helmet from "helmet";
import "reflect-metadata";
import { env } from "./config";
import { errorMiddleware } from "./middleware/error.middleware";
import { AuthRouter } from "./modules/auth/auth.router";
import { SampleRouter } from "./modules/sample/sample.router";

export default class App {
  public app;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(json());
  }

  private routes(): void {
    const sampleRouter = new SampleRouter();
    const authRouter = new AuthRouter();

    this.app.use("/samples", sampleRouter.getRouter());
    this.app.use("/auth", authRouter.getRouter());
  }

  private handleError(): void {
    this.app.use(errorMiddleware);
  }

  public start(): void {
    this.app.listen(env().PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${env().PORT}`);
    });
  }
}
