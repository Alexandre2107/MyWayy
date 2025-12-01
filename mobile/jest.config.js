module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@react-native-async-storage/async-storage)",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "utils/**/*.{ts,tsx}",
    "requests/**/*.{ts,tsx}",
    "services/**/*.{ts,tsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/*.config.js",
    "!**/jest.setup.js",
    "!**/scripts/**",
    "!**/__tests__/**",
    "!**/app/**",
    "!**/interface/**",
    "!**/constants/**",
    "!**/*.d.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 45,
      lines: 48,
      statements: 48,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
};
