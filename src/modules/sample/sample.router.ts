import { Router } from "express";
import { env } from "../../config";
import { JwtMiddleware } from "../../middleware/jwt.middleware";
import { verifyRole } from "../../middleware/role.middleware";
import { fileFilter, uploader } from "../../middleware/uploader.middleware";
import { validateBody } from "../../middleware/validation.middleware";
import { CreateSampleDTO } from "./dto/create-sample.dto";
import { UpdateSampleDTO } from "./dto/update-sample.dto";
import { SampleController } from "./sample.controller";

export class SampleRouter {
  private router: Router;
  private sampleController: SampleController;
  private jwtMiddleware: JwtMiddleware;

  constructor() {
    this.sampleController = new SampleController();
    this.jwtMiddleware = new JwtMiddleware(env().JWT_SECRET);
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router.get("/", this.sampleController.getSamples); // NOTE: public route
    this.router.get(
      "/:id",
      this.jwtMiddleware.verifyToken, // NOTE: private route & RBAC
      verifyRole(["USER"]),
      this.sampleController.getSample,
    );
    this.router.post(
      "/",
      uploader().fields([{ name: "image", maxCount: 1 }]),
      fileFilter,
      validateBody(CreateSampleDTO),
      this.sampleController.createSample,
    );
    this.router.patch(
      "/:id",
      validateBody(UpdateSampleDTO),
      this.sampleController.updateSample,
    );
    this.router.delete("/:id", this.sampleController.deleteSample);
  };

  getRouter(): Router {
    return this.router;
  }
}
