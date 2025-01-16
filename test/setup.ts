import { execSync } from "child_process";
import prisma from "../src/prisma";

beforeEach(async () => {
  execSync("npx prisma migrate reset --force --skip-seed");
  execSync("npx prisma db push");
});

afterAll(async () => {
  await prisma.$disconnect();
});
