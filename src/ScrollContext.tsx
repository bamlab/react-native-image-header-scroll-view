import React from 'react';
import { Animated } from 'react-native';

export interface ScrollContext {
  scrollValue: Animated.Value;
  scrollPageY: number;
}

const initialValue: ScrollContext = {
  scrollValue: new Animated.Value(0),
  scrollPageY: 0,
};
const Context = React.createContext(initialValue);

export const ScrollProvider = Context.Provider;
export const ScrollConsumer = Context.Consumer;

