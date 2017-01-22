import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, StatusBar, View, Dimensions } from 'react-native';
import { NavigationBar } from '@exponent/ex-navigation';

import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

const MIN_HEIGHT = NavigationBar.DEFAULT_HEIGHT;

const styles = StyleSheet.create({
  container: {
    marginTop: -MIN_HEIGHT,
    flex: 1,
  },
  image: {
    height: 200,
    width: Dimensions.get('window').width,
  },
});


class BasicUsage extends React.Component {
  render() {
    return (
      <View style={styles.container} >
        <HeaderImageScrollView
          maxHeight={200}
          minHeight={MIN_HEIGHT}
          renderHeader={() => (
            <Image source={require('../assets/NZ.jpg')} style={styles.image} />
          )}
        >
          <View style={{ height: 1000 }}>
            <TriggeringView onHide={() => console.log('text hidden')} >
              <Text>Scroll Me!</Text>
            </TriggeringView>
          </View>
        </HeaderImageScrollView>
      </View>
    );
  }
}

BasicUsage.route = {
  navigationBar: {
    tintColor: 'white',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    statusBarHeight: 0,
    elevation: 0,
  },
};

export default BasicUsage;
