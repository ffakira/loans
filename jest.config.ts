import type { Config } from "jest";
import { register } from "ts-node";
import { compilerOptions } from "./tsconfig.json";
import { pathsToModuleNameMapper } from "ts-jest";

register({ transpileOnly: true });

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testRegex: "/__tests__/.*\\.(test|spec)\\.ts$",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "/__tests__/"],
  coverageReporters: ["json", "text", "lcov", "clover"],
};

export default config;
