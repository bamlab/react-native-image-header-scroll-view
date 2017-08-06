import { StackNavigator } from 'react-navigation';

import { Menu, TvShow, BasicUsage, ColorsPage, Avignon, PullToRefresh } from './Pages';

export const App = StackNavigator(
  {
    menu: {
      screen: Menu,
    },
    tvShow: {
      screen: TvShow,
    },
    basicUsage: {
      screen: BasicUsage,
    },
    colors: {
      screen: ColorsPage,
    },
    avignon: {
      screen: Avignon,
    },
    pullrefresh: {
      screen: PullToRefresh,
    },
  },
  {
    navigationOptions: {
      headerTintColor: 'white',
      headerStyle: {
        position: 'absolute',
        top: 0,
        elevation: 0,
        shadowColor: 'transparent',
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        },
      },
    },
  }
);

export default App;
