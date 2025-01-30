import { PrismaClient } from "@prisma/client";

class PrismaService extends PrismaClient {
  constructor() {
    super();

    process.on("SIGINT", async () => {
      await this.$disconnect();
      process.exit(0);
    });
  }
}

export default PrismaService;
