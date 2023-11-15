export default {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "@shelf/jest-dynamodb",
  testMatch: ["**/unit/*.test.ts"],
};
