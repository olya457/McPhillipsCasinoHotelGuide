require('react-native-gesture-handler/jestSetup');

jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(key => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn(key => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store = {};
        return Promise.resolve();
      }),
    },
  };
});

jest.mock('react-native-webview', () => {
  const {View} = require('react-native');
  return {WebView: View, default: View};
});

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = {top: 0, right: 0, bottom: 0, left: 0};
  const {View} = require('react-native');
  return {
    SafeAreaProvider: ({children}) => children,
    SafeAreaView: View,
    SafeAreaInsetsContext: {
      Consumer: ({children}) => children(inset),
      Provider: ({children}) => children,
    },
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({x: 0, y: 0, width: 390, height: 844}),
    initialWindowMetrics: {frame: {x: 0, y: 0, width: 390, height: 844}, insets: inset},
  };
});
