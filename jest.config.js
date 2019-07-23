module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: 'src/.*\\.(test|spec)\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['<rootDir>'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|static-container|react-native-formik|react-native-vector-icons|react-native-version-number|react-native-device-info|react-navigation|react-native-safe-area-view|react-navigation-drawer|react-native-easy-grid|react-native-elements|react-navigation-stack|react-native-fontawesome|react-native-progress|react-native-material-dropdown|react-native-material-ripple|react-native-material-textfield|react-native-material-buttons|react-native-languages|react-native-restart|react-native-keyboard-aware-scroll-view|react-native-iphone-x-helper|react-native-collapsible|react-native-modal|react-native-animatable|@react-native-community/async-storage|@react-navigation/.*))',
  ],
  cacheDirectory: '.jest/cache',
};
