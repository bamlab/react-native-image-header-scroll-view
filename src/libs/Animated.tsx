import { NativeModules, Animated as RNAnimated } from 'react-native';

let Animated = RNAnimated;

if (NativeModules.ReanimatedModule) {
  Animated = require('react-native-reanimated');
}

export default Animated;
