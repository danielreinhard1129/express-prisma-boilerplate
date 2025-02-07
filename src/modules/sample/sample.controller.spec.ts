import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { mockImageData } from "../../../test/fixtures/mock-image-data";
import { mockSampleData } from "../../../test/integration/sample/utils";
import { ApiError } from "../../utils/api-error";
import { GetSamplesDTO } from "./dto/get-samples.dto";
import { SampleController } from "./sample.controller";
import { SampleService } from "./sample.service";

describe("SampleController", () => {
  let sampleController: SampleController;
  let sampleServiceMock: jest.Mocked<SampleService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    sampleServiceMock = {
      getSamples: jest.fn(),
      getSample: jest.fn(),
      createSample: jest.fn(),
      updateSample: jest.fn(),
      deleteSample: jest.fn(),
    } as unknown as jest.Mocked<SampleService>;

    sampleController = new SampleController(sampleServiceMock);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("getSamples", () => {
    it("should return 200 and samples on success", async () => {
      // Arrange
      const mockQuery = { page: "1", limit: "10" };
      const mockDto = plainToInstance(GetSamplesDTO, mockQuery);
      const mockSamples = mockSampleData({ numberOfSamples: 2 });
      const mockMeta = {
        hasNext: false,
        hasPrevious: false,
        page: 1,
        perPage: 10,
        total: 10,
      };
      const mockResult = { data: mockSamples, meta: mockMeta };
      sampleServiceMock.getSamples.mockResolvedValue(mockResult);
      mockRequest.query = mockQuery;

      // Act
      await sampleController.getSamples(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(sampleServiceMock.getSamples).toHaveBeenCalledWith(mockDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockResult);
    });

    it("should call next with error on failure", async () => {
      // Arrange
      const mockError = new Error();
      sampleServiceMock.getSamples.mockRejectedValue(mockError);
      mockRequest.query = { page: "1", limit: "10" };

      // Act
      await sampleController.getSamples(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(sampleServiceMock.getSamples).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getSample", () => {
    it("should return 200 and the sample on success", async () => {
      // Arrange
      const mockId = 1;
      const [mockSample] = mockSampleData({ numberOfSamples: 1 });
      sampleServiceMock.getSample.mockResolvedValue(mockSample);
      mockRequest.params = { id: String(mockId) };

      // Act
      await sampleController.getSample(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(sampleServiceMock.getSample).toHaveBeenCalledWith(mockId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockSample);
    });

    it("should call next with error on failure", async () => {
      // Arrange
      const mockId = 1;
      const mockError = new Error();
      sampleServiceMock.getSample.mockRejectedValue(mockError);
      mockRequest.params = { id: String(mockId) };

      // Act
      await sampleController.getSample(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(sampleServiceMock.getSample).toHaveBeenCalledWith(mockId);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("createSample", () => {
    it("should return 200 and the created sample on success", async () => {
      // Arrange
      const mockImages = mockImageData({ numberOfImages: 1 });
      const [mockSample] = mockSampleData({ numberOfSamples: 1 });
      const mockFiles = { image: mockImages };
      const mockBody = { name: mockSample.name };
      mockRequest.files = mockFiles;
      mockRequest.body = mockBody;
      sampleServiceMock.createSample.mockResolvedValue(mockSample);

      // Act
      await sampleController.createSample(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(sampleServiceMock.createSample).toHaveBeenCalledWith(
        mockBody,
        mockFiles.image[0],
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockSample);
    });

    it("should throw an ApiError if no image is provided", async () => {
      // Arrange
      mockRequest.files = {};
      mockRequest.body = { name: "New Sample" };

      // Act
      await sampleController.createSample(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        new ApiError("Image is required", 400),
      );
    });

    it("should call next with error on failure", async () => {
      // Arrange
      const mockImages = mockImageData({ numberOfImages: 1 });
      const mockFiles = { image: mockImages };
      const mockBody = { name: "New Sample" };
      mockRequest.files = mockFiles;
      mockRequest.body = mockBody;

      const mockError = new Error();
      sampleServiceMock.createSample.mockRejectedValue(mockError);

      // Act
      await sampleController.createSample(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(sampleServiceMock.createSample).toHaveBeenCalledWith(
        mockBody,
        mockFiles.image[0],
      );
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("updateSample", () => {
    it("should return 200 and the updated sample on success", async () => {
      // Arrange
      const [mockSample] = mockSampleData({ numberOfSamples: 1 });
      const mockId = 1;
      const mockBody = { name: mockSample.name };
      const mockUpdatedSample = mockSample;
      mockRequest.params = { id: String(mockId) };
      mockRequest.body = mockBody;
      sampleServiceMock.updateSample.mockResolvedValue(mockUpdatedSample);

      // Act
      await sampleController.updateSample(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(sampleServiceMock.updateSample).toHaveBeenCalledWith(
        mockId,
        mockBody,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockUpdatedSample);
    });

    it("should call next with error on failure", async () => {
      // Arrange
      const [mockSample] = mockSampleData({ numberOfSamples: 1 });
      const mockId = 1;
      const mockBody = { name: mockSample.name };
      const mockError = new Error();
      mockRequest.params = { id: String(mockId) };
      mockRequest.body = mockBody;
      sampleServiceMock.updateSample.mockRejectedValue(mockError);

      // Act
      await sampleController.updateSample(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(sampleServiceMock.updateSample).toHaveBeenCalledWith(
        mockId,
        mockBody,
      );
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("deleteSample", () => {
    it("should return 200 and the deletion result on success", async () => {
      // Arrange
      const mockId = 1;
      const mockDeletionResult = { message: "Sample deleted successfully" };
      mockRequest.params = { id: String(mockId) };
      sampleServiceMock.deleteSample.mockResolvedValue(mockDeletionResult);

      // Act
      await sampleController.deleteSample(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(sampleServiceMock.deleteSample).toHaveBeenCalledWith(mockId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockDeletionResult);
    });

    it("should call next with error on failure", async () => {
      // Arrange
      const mockId = 1;
      const mockError = new Error();
      mockRequest.params = { id: String(mockId) };
      sampleServiceMock.deleteSample.mockRejectedValue(mockError);

      // Act
      await sampleController.deleteSample(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(sampleServiceMock.deleteSample).toHaveBeenCalledWith(mockId);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
