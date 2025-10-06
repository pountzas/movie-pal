module.exports = {
  testEnvironment: 'jsdom',
  rootDir: __dirname,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|expo|@expo|react-native-.*|@react-native-.*)',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'store/**/*.{js,jsx,ts,tsx}',
    'actions/**/*.{js,jsx,ts,tsx}',
    '!**/__tests__/**',
    '!**/*.test.{js,jsx,ts,tsx}',
    '!**/*.config.{js,ts}',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/components/__tests__/**/*.test.tsx',
    '**/app/__tests__/**/*.test.tsx',
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
