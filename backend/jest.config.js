
import { createDefaultEsmPreset } from "ts-jest";

const config = {
  ...createDefaultEsmPreset({
    tsconfig: "tsconfig.json",
  }),

  testEnvironment: "node",

  testMatch: ["<rootDir>/tests/**/*.test.ts"],

  clearMocks: true,
  
  moduleNameMapper: {
  "^(\\.{1,2}/.*)\\.js$": "$1",
},
};

export default config;
