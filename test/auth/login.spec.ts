import request from "supertest";
import App from "../../src/app";
import { PasswordService } from "../../src/modules/auth/password.service";
import prisma from "../../src/prisma";
import { mockUserData } from "../user/utils";

describe("POST /auth/login", () => {
  const { app } = new App();

  it(`should login successfully`, async () => {
    const [user] = mockUserData({ numberOfUsers: 1 });
    const { hashPassword } = new PasswordService();
    const hashedPassword = await hashPassword("Password123");
    await prisma.user.create({
      data: { ...user, password: hashedPassword },
    });

    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "Password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });

  it(`should return an error when the password is incorrect`, async () => {
    const [user] = mockUserData({ numberOfUsers: 1 });
    const { hashPassword } = new PasswordService();
    const hashedPassword = await hashPassword("Password123");
    await prisma.user.create({
      data: { email: user.email, password: hashedPassword },
    });

    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "WrongPassword" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  it(`should return an error when the email is not found`, async () => {
    const email = "nonexistent@example.com";

    const response = await request(app)
      .post("/auth/login")
      .send({ email, password: "Password123" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });
});
