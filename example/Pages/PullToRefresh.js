import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Header } from 'react-navigation';

import HeaderImageScrollView from 'react-native-image-header-scroll-view';

const MIN_HEIGHT = Header.HEIGHT;
const MAX_HEIGHT = 200;

class BasicUsage extends React.Component {
  constructor() {
    super();
    this.state = {
      refreshing: false,
    };
  }

  _onRefresh() {
    this.setState({
      refreshing: true,
    });

    setTimeout(() => {
      this.setState({
        refreshing: false,
      });
    }, 2000);
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderImageScrollView
          maxHeight={MAX_HEIGHT}
          minHeight={MIN_HEIGHT}
          minOverlayOpacity={0.4}
          renderHeader={() =>
            <Image source={require('../assets/pullrefresh.jpg')} style={styles.image} />}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="white"
            />
          }
          renderTouchableFixedForeground={() =>
            <View style={{ height: MAX_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => console.log('tap!!')} style={styles.button}>
                <Text style={styles.buttonText}>Click Me!</Text>
              </TouchableOpacity>
            </View>}
        >
          <View style={{ height: 1000 }} />
        </HeaderImageScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: MAX_HEIGHT,
    width: Dimensions.get('window').width,
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderColor: 'white',
    backgroundColor: '#00000066',
  },
  buttonText: {
    color: 'white',
    backgroundColor: 'transparent',
  },
});

export default BasicUsage;
