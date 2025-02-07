import { readFileSync } from "fs";
import nock from "nock";
import { join } from "path";
import request from "supertest";
import App from "../../../src/app";
import { env } from "../../../src/config";

describe("POST /samples", () => {
  const { app } = new App();

  beforeEach(() => {
    // Intercept Cloudinary API calls
    nock("https://api.cloudinary.com")
      .post(`/v1_1/${env().CLOUDINARY_CLOUD_NAME}/image/upload`)
      .reply(200, {
        secure_url: "http://mocked-url.com/image.jpg",
        public_id: "mocked-public-id",
      });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it(`should successfuly create a sample`, async () => {
    const imagePath = join(__dirname, "../../fixtures", "mock-image.png");
    const imageBuffer = readFileSync(imagePath);
    const response = await request(app)
      .post("/samples")
      .field("name", "Test Sample")
      .attach("image", imageBuffer, "test-image.jpg");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
  });

  it(`should return an error when name is missing`, async () => {
    const response = await request(app).post("/samples");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "name must be a string, name should not be empty",
    );
  });

  it(`should return an error when image is missing`, async () => {
    const response = await request(app)
      .post("/samples")
      .field("name", "Test Sample");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Image is required");
  });
});
