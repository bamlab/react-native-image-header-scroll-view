import React from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native';
import { NavigationBar } from '@exponent/ex-navigation';

import HeaderImageScrollView from 'react-native-image-header-scroll-view';

const MIN_HEIGHT = NavigationBar.DEFAULT_HEIGHT;

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: Dimensions.get('window').width,
  },
});

class ColorsPage extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, marginTop: -MIN_HEIGHT }}>
        <HeaderImageScrollView
          maxHeight={150}
          minHeight={80}
          fadeOutForeground
          renderHeader={() => (
            <Image source={require('../assets/cutecat.jpg')} style={styles.image} />
          )}
        >
          <View style={{ height: 100, backgroundColor: 'blue' }} />
          <View style={{ height: 100, backgroundColor: 'red' }} />
          <View style={{ height: 100, backgroundColor: 'green' }} />
          <View style={{ height: 100, backgroundColor: 'purple' }} />
          <View style={{ height: 100, backgroundColor: 'orange' }} />
          <View style={{ height: 100, backgroundColor: 'pink' }} />
          <View style={{ height: 100, backgroundColor: 'brown' }} />
          <View style={{ height: 100, backgroundColor: 'yellow' }} />
        </HeaderImageScrollView>
      </View>
    );
  }
}

ColorsPage.route = {
  navigationBar: {
    tintColor: 'white',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    statusBarHeight: 0,
    elevation: 0,
  },
};

export default ColorsPage;
