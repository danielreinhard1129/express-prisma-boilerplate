import { readFileSync } from "fs";
import { join } from "path";
import request from "supertest";
import App from "../../src/app";

// NOTE: Optional
// jest.mock("nodemailer", () => ({
//   createTransport: jest.fn().mockImplementation(() => ({
//     sendMail: jest.fn(),
//   })),
// }));

jest.mock("../../src/modules/mail/mail.service", () => {
  return {
    MailService: jest.fn().mockImplementation(() => ({
      sendEmail: jest.fn().mockResolvedValue({}),
    })),
  };
});

jest.mock("../../src/modules/cloudinary/cloudinary.service", () => {
  return jest.fn().mockImplementation(() => ({
    upload: jest.fn().mockResolvedValue({
      secure_url: "http://mocked-url.com/image.jpg",
      public_id: "mocked-public-id",
    }),
  }));
});

describe("POST /samples", () => {
  const { app } = new App();

  it(`should successfuly create a sample`, async () => {
    const imagePath = join(__dirname, "../mocks", "mock-image.png");
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
});
