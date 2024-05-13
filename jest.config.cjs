module.exports = {
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/__tests__/**/*.test.[jt]s"],
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "__tests__/tsconfig.json",
      },
    ],
  },
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
