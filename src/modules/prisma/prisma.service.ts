import { PrismaClient } from "@prisma/client";

class PrismaService {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient();

      process.on("SIGINT", async () => {
        await this.instance.$disconnect();
        process.exit(0);
      });
    }

    return this.instance;
  }
}

export default PrismaService;
