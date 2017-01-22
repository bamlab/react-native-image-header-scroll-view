import React from 'react';
import {
  AppRegistry,
  Text,
  View,
} from 'react-native';

import Exponent from 'exponent';

import {
  createRouter,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';

import { Menu, TvShow } from './Pages';

export const Router = createRouter(() => ({
  menu: () => Menu,
  tvShow: () => TvShow,
}));

class App extends React.Component {
  render() {
    return (
      <NavigationProvider router={Router}>
        <StackNavigation initialRoute={Router.getRoute('menu')} />
      </NavigationProvider>
    );
  }
}

Exponent.registerRootComponent(App);
