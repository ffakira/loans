import { type Config } from "jest";
import { register } from "ts-node";

register({ transpileOnly: true });

const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.ts'],
} satisfies Config;

export default config;
