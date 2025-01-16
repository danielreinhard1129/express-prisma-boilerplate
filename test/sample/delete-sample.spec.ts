import request from "supertest";
import App from "../../src/app";
import prisma from "../../src/prisma";
import { mockSampleData } from "./utils";

describe("DELETE /samples/:id", () => {
  const { app } = new App();

  it(`should successfully delete an existing sample`, async () => {
    const numberOfSamples = 1;
    const [sample] = mockSampleData({ numberOfSamples });
    await prisma.sample.createMany({ data: sample });

    const response = await request(app).delete(`/samples/${sample.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Delete sample success");
  });

  it(`should return an error when attempting to delete a non-existent sample`, async () => {
    const nonExistentSampleId = 9999;
    const response = await request(app).patch(
      `/samples/${nonExistentSampleId}`,
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Record not found");
  });
});
