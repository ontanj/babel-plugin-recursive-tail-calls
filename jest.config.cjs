module.exports = {
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/tests/**/*.test.[jt]s"],
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tests/tsconfig.json",
      },
    ],
  },
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
