import request from "supertest";
import App from "../../src/app";
import prisma from "../../src/prisma";
import { mockUserData } from "../user/utils";

describe("POST /auth/register", () => {
  const { app } = new App();

  it(`should register successfully`, async () => {
    const [body] = mockUserData({ numberOfUsers: 1 });

    const response = await request(app)
      .post("/auth/register")
      .send({ email: body.email, password: body.password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("role");
  });

  it(`should return an error if the email already exists`, async () => {
    const [user] = mockUserData({ numberOfUsers: 1 });
    await prisma.user.create({ data: user });

    const response = await request(app)
      .post("/auth/register")
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email already exist");
  });

  it(`should return an error if both email and password are missing`, async () => {
    const response = await request(app).post("/auth/register").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
