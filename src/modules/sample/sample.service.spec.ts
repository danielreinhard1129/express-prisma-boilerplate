import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { plainToInstance } from "class-transformer";
import { UploadApiResponse } from "cloudinary";
import { Context, createMockContext, MockContext } from "../../../test/context";
import { mockImageData } from "../../../test/mocks/mock-image-data";
import { mockSampleData } from "../../../test/sample/utils";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { MailService } from "../mail/mail.service";
import { PaginationService } from "../pagination/pagination.service";
import { GetSamplesDTO } from "./dto/get-samples.dto";
import { UpdateSampleDTO } from "./dto/update-sample.dto";
import { SampleService } from "./sample.service";

describe("SampleService", () => {
  let mockCtx: MockContext;
  let ctx: Context;
  let mailService: MailService;
  let paginationService: PaginationService;
  let fileService: CloudinaryService;
  let sampleService: SampleService;

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    mailService = new MailService();
    paginationService = new PaginationService();
    fileService = new CloudinaryService();
    sampleService = new SampleService(
      ctx.prisma,
      mailService,
      paginationService,
      fileService,
    );
  });

  describe("getSamples", () => {
    it("should return samples with correct pagination meta", async () => {
      const numberOfSamples = 3;
      const samples = mockSampleData({ numberOfSamples });

      mockCtx.prisma.sample.findMany.mockResolvedValueOnce(samples);
      mockCtx.prisma.sample.count.mockResolvedValueOnce(numberOfSamples);

      const query = plainToInstance(GetSamplesDTO, {});
      const result = await sampleService.getSamples(query);

      expect(result.data).toBe(samples);
      expect(result.meta).toBeDefined();
      expect(result.meta.total).toBe(numberOfSamples);
      expect(result.meta.page).toBeDefined();
      expect(result.meta.perPage).toBeDefined();
    });
  });

  describe("getSample", () => {
    it("should return the sample with the correct id", async () => {
      const numberOfSamples = 1;
      const [sample] = mockSampleData({ numberOfSamples });

      mockCtx.prisma.sample.findFirstOrThrow.mockResolvedValueOnce(sample);

      const result = await sampleService.getSample(sample.id);
      expect(result).toBe(sample);
    });

    it("should throw an error if sample with the given id does not exist", async () => {
      const mockSampleId = -1;

      mockCtx.prisma.sample.findFirstOrThrow.mockRejectedValueOnce(
        new PrismaClientKnownRequestError("Record not found", {
          code: "P2025",
          clientVersion: "foo",
        }),
      );

      expect(sampleService.getSample(mockSampleId)).rejects.toThrow(
        "Record not found",
      );
    });
  });

  describe("createSample", () => {
    it("should create sample successfully", async () => {
      const numberOfSamples = 1;
      const [sample] = mockSampleData({ numberOfSamples });
      const [image] = mockImageData({ numberOfImages: 1 });

      jest.spyOn(fileService, "upload").mockResolvedValue({
        public_id: "mocked_public_id",
        secure_url: "https://mocked.url/image.jpg",
      } as UploadApiResponse);

      jest.spyOn(mailService, "sendEmail").mockResolvedValue(undefined);

      mockCtx.prisma.sample.create.mockResolvedValueOnce(sample);

      const result = await sampleService.createSample(sample, image);

      expect(result).toBe(sample);
    });

    it("should handle image upload failure", async () => {
      const numberOfSamples = 1;
      const [sample] = mockSampleData({ numberOfSamples });
      const [image] = mockImageData({ numberOfImages: 1 });

      const uploadError = new Error("error upload");
      jest.spyOn(fileService, "upload").mockRejectedValueOnce(uploadError);

      expect(sampleService.createSample(sample, image)).rejects.toThrow(
        uploadError,
      );
    });
  });

  describe("updateSample", () => {
    const body: UpdateSampleDTO = { name: "Updated Sample" };

    it("should update the sample successfully", async () => {
      const numberOfSamples = 1;
      const [sample] = mockSampleData({ numberOfSamples });
      const updatedSample = { ...sample, ...body };

      mockCtx.prisma.sample.findFirstOrThrow.mockResolvedValueOnce(sample);
      mockCtx.prisma.sample.update.mockResolvedValueOnce(updatedSample);

      const result = await sampleService.updateSample(sample.id, body);

      expect(result).toEqual(updatedSample);
    });

    it("should throw an error if sample with the given id does not exist", async () => {
      const mockSampleId = -1;

      mockCtx.prisma.sample.findFirstOrThrow.mockRejectedValueOnce(
        new PrismaClientKnownRequestError("Record not found", {
          code: "P2025",
          clientVersion: "foo",
        }),
      );

      expect(sampleService.updateSample(mockSampleId, body)).rejects.toThrow(
        "Record not found",
      );
    });
  });

  describe("deleteSample", () => {
    it("should delete the sample successfully", async () => {
      const numberOfSamples = 1;
      const [sample] = mockSampleData({ numberOfSamples });

      mockCtx.prisma.sample.findFirstOrThrow.mockResolvedValueOnce(sample);

      mockCtx.prisma.sample.update.mockResolvedValueOnce({
        ...sample,
        deletedAt: new Date(),
      });

      const result = await sampleService.deleteSample(sample.id);

      expect(result).toEqual({ message: "Delete sample success" });
    });

    it("should throw an error if sample with the given id does not exist", async () => {
      const mockSampleId = -1;

      mockCtx.prisma.sample.findFirstOrThrow.mockRejectedValueOnce(
        new PrismaClientKnownRequestError("Record not found", {
          code: "P2025",
          clientVersion: "foo",
        }),
      );

      expect(sampleService.deleteSample(mockSampleId)).rejects.toThrow(
        "Record not found",
      );
    });
  });
});
