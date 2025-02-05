require("dotenv-flow").config();

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  testMatch:
    process.env.TEST_TYPE === "integration"
      ? ["<rootDir>/test/**/*.(spec|test).ts"]
      : ["<rootDir>/src/**/*.(spec|test).ts"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
