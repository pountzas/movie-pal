// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve())
}));

// Mock expo-router navigation
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn()
  }),
  useLocalSearchParams: jest.fn()
}));

// Mock axios for API calls
jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: { cast: [] } }))
}));

// Global test utilities
global.flushMicrotasks = () => new Promise((resolve) => setImmediate(resolve));
