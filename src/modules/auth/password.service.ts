import argon2 from "argon2";

export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, plainPassword);
  }
}
