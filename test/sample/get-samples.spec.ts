import request from "supertest";
import App from "../../src/app";
import prisma from "../../src/prisma";
import { mockSampleData } from "./utils";

describe("GET /samples", () => {
  const { app } = new App();

  it(`should display up to 10 samples per page with pagination information.`, async () => {
    const numberOfSamples = 3;
    const samples = mockSampleData({ numberOfSamples });
    await prisma.sample.createMany({ data: samples });

    const response = await request(app).get("/samples");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(numberOfSamples);
    expect(response.body.meta).toMatchObject({
      hasNext: false,
      hasPrevious: false,
      page: 1,
      perPage: 5,
      total: numberOfSamples,
    });
  });
});
