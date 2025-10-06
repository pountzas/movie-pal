import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
  useSegments: () => [],
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Silence the warning: Animated: `useNativeDriver` is not supported
// Note: This mock may not be needed in newer React Native versions
try {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
} catch (error) {
  // Module may not exist in this React Native version, skip mocking
}

// Mock expo-constants
jest.mock('expo-constants', () => ({
  default: {
    statusBarHeight: 20,
    expoVersion: '1.0.0',
  },
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock NativeWind/Tailwind CSS
jest.mock('nativewind', () => ({
  styled: () => (component: any) => component,
}));

// Setup React Native testing environment
import 'react-native-gesture-handler/jestSetup';

// Initialize React Native globals
global.__DEV__ = true;
global.__RCTProfileIsProfiling = false;

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock React Native modules that require native bridge
jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => ({
  AsyncLocalStorage: {},
}));

// Mock TurboModuleRegistry
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: () => ({}),
}));

// Mock React Native Feature Flags
jest.mock('react-native/src/private/featureflags/ReactNativeFeatureFlags', () => ({
  useTurboModuleInterop: () => false,
  enableNativeCSSParsing: () => {},
}));

// Mock React Native CSS Interop
jest.mock('react-native-css-interop', () => ({}));

// Setup testing-library
// Note: extend-expect may not be available in newer versions
