import { Context, createMockContext, MockContext } from "../../../test/context";
import { mockUserData } from "../../../test/user/utils";
import { AuthService } from "./auth.service";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";

describe("SampleService", () => {
  let mockCtx: MockContext;
  let ctx: Context;
  let passwordService: PasswordService;
  let tokenService: TokenService;
  let authService: AuthService;

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    passwordService = new PasswordService();
    tokenService = new TokenService();
    authService = new AuthService(ctx.prisma, passwordService, tokenService);
  });

  describe("login", () => {
    it("should return user data with access token", async () => {
      const numberOfUsers = 1;
      const [user] = mockUserData({ numberOfUsers });

      mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);

      jest.spyOn(passwordService, "comparePassword").mockResolvedValue(true);
      jest.spyOn(tokenService, "generateToken").mockReturnValue("mAccessToken");

      const body = { email: user.email, password: "CorrectPassword" };
      const result = await authService.login(body);

      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
      expect(result.accessToken).toBeDefined();
      expect(result).not.toHaveProperty("password");
    });

    it("should throw an error if the user is not found", async () => {
      mockCtx.prisma.user.findFirst.mockResolvedValueOnce(null);

      const body = {
        email: "nonexistent@example.com",
        password: "WrongPassword",
      };

      expect(authService.login(body)).rejects.toThrow("User not found");
    });

    it("should throw an error if the password is incorrect", async () => {
      const numberOfUsers = 1;
      const [user] = mockUserData({ numberOfUsers });

      mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);
      jest.spyOn(passwordService, "comparePassword").mockResolvedValue(false);

      const body = { email: user.email, password: "WrongPassword" };

      expect(authService.login(body)).rejects.toThrow("Invalid credentials");
    });
  });
  describe("register", () => {
    it("should register user successfully", async () => {
      const numberOfUsers = 1;
      const [user] = mockUserData({ numberOfUsers });

      mockCtx.prisma.user.findFirst.mockResolvedValueOnce(null);

      jest
        .spyOn(passwordService, "hashPassword")
        .mockResolvedValue("hashedPassword");

      mockCtx.prisma.user.create.mockResolvedValueOnce({
        ...user,
        password: "hashedPassword",
      });

      const result = await authService.register({
        email: user.email,
        password: user.password,
      });

      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
    });

    it("should throw an error if the email already exists", async () => {
      const numberOfUsers = 1;
      const [user] = mockUserData({ numberOfUsers });

      mockCtx.prisma.user.findFirst.mockResolvedValueOnce(user);

      const body = { email: user.email, password: "PlainPassword123" };

      expect(authService.register(body)).rejects.toThrow("Email already exist");
    });
  });
});
