import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/", "<rootDir>/e2e/"],
  moduleNameMapper: {
    // Se você usa alias no tsconfig (ex.: @/ ou @lib/)
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
  },
};

export default createJestConfig(customJestConfig);