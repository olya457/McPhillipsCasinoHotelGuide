module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?(@react-native|react-native|@react-navigation|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-linear-gradient|react-native-webview|react-native-svg|react-native-image-picker|@react-native-async-storage|@react-native-masked-view))',
  ],
};
