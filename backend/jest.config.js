
import { createDefaultEsmPreset } from "ts-jest";

const config = {
  ...createDefaultEsmPreset({
    tsconfig: "tsconfig.json",
  }),

  testEnvironment: "node",

  testMatch: ["<rootDir>/tests/**/*.test.ts"],

  clearMocks: true,
};

export default config;
