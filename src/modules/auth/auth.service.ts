import { env } from "../../config";
import { ApiError } from "../../utils/api-error";
import PrismaService from "../prisma/prisma.service";
import { prismaExclude } from "../prisma/utils";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";

export class AuthService {
  private prisma;
  private passwordService;
  private tokenService;

  constructor() {
    this.prisma = PrismaService.getInstance();
    this.passwordService = new PasswordService();
    this.tokenService = new TokenService(env().JWT_SECRET);
  }

  login = async (body: LoginDTO) => {
    const { email, password } = body;

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      throw new ApiError("User not found", 404);
    }

    const isPasswordValid = this.passwordService.comparePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new ApiError("Invalid credentials", 400);
    }

    const accessToken = this.tokenService.generateToken({
      id: existingUser.id,
      role: existingUser.role,
    });

    const { password: pw, ...userWithoutPassword } = existingUser;

    return { ...userWithoutPassword, accessToken };
  };

  register = async (body: RegisterDTO) => {
    const { email, password } = body;

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError("Email already exist", 400);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    return await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: prismaExclude("User", ["password"]),
    });
  };
}
