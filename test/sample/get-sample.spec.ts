import request from "supertest";
import App from "../../src/app";
import { env } from "../../src/config";
import { TokenService } from "../../src/modules/auth/token.service";
import prisma from "../../src/prisma";
import { mockUserData } from "../user/utils";
import { mockSampleData } from "./utils";

describe("GET /samples/:id", () => {
  const { app } = new App();

  it(`should provide sample with the requested id`, async () => {
    const numberOfSamples = 1;
    const [sample] = mockSampleData({ numberOfSamples });
    await prisma.sample.createMany({ data: sample });

    const numberOfUsers = 1;
    const [user] = mockUserData({ numberOfUsers });
    const tokenService = new TokenService();
    const token = tokenService.generateToken(
      { id: user.id, role: user.role },
      env().JWT_SECRET,
    );

    const response = await request(app)
      .get(`/samples/${sample.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(JSON.parse(JSON.stringify(sample)));
  });

  it(`should return 404 Not Found if the sample with the given id does not exist`, async () => {
    const numberOfUsers = 1;
    const [user] = mockUserData({ numberOfUsers });
    const tokenService = new TokenService();
    const token = tokenService.generateToken(
      { id: user.id, role: user.role },
      env().JWT_SECRET,
    );

    const nonExistentSampleId = 9999;

    const response = await request(app)
      .get(`/samples/${nonExistentSampleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Record not found");
  });

  it(`should return 401 Unauthorized if the token is not provided`, async () => {
    const numberOfSamples = 1;
    const [sample] = mockSampleData({ numberOfSamples });

    const response = await request(app).get(`/samples/${sample.id}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "No token provided");
  });
});
