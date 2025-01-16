import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { CreateSampleDTO } from "./dto/create-sample.dto";
import { GetSamplesDTO } from "./dto/get-samples.dto";
import { UpdateSampleDTO } from "./dto/update-sample.dto";
import { SampleService } from "./sample.service";

export class SampleController {
  private sampleService: SampleService;

  constructor() {
    this.sampleService = new SampleService();
  }

  getSamples = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = plainToInstance(GetSamplesDTO, req.query);
      const result = await this.sampleService.getSamples(query);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  getSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.user; // token payload
      const id = Number(req.params.id);
      const result = await this.sampleService.getSample(id);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  createSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const image = files.image?.[0];
      const body = req.body as CreateSampleDTO;
      const result = await this.sampleService.createSample(body, image);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  updateSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const body = req.body as UpdateSampleDTO;
      const result = await this.sampleService.updateSample(id, body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  deleteSample = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await this.sampleService.deleteSample(id);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
