import React from 'react';
import { AppRegistry, Text, View } from 'react-native';

import { createRouter, NavigationProvider, StackNavigation } from '@exponent/ex-navigation';

import { Menu, TvShow, BasicUsage, ColorsPage, Avignon } from './Pages';

export const Router = createRouter(() => ({
  menu: () => Menu,
  tvShow: () => TvShow,
  basicUsage: () => BasicUsage,
  colors: () => ColorsPage,
  avignon: () => Avignon,
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

export default App;
