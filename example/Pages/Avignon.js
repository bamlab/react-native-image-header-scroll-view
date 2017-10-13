import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View, Dimensions } from 'react-native';

import { Header } from 'react-navigation';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

const MIN_HEIGHT = Header.HEIGHT;
const MAX_HEIGHT = 200;

class BasicUsage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <HeaderImageScrollView
          maxHeight={MAX_HEIGHT}
          minHeight={MIN_HEIGHT}
          minOverlayOpacity={0.4}
          renderHeader={() =>
            <Image source={require('../assets/avignon.jpg')} style={styles.image} />}
          renderFixedForeground={() =>
            <View style={{ height: MAX_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => console.log('tap!!')} style={styles.button}>
                <Text style={styles.buttonText}>Discover Avignon now!</Text>
              </TouchableOpacity>
            </View>}
        >
          <View style={{ height: 1000 }}>
            <TriggeringView onHide={() => console.log('text hidden')}>
              <TouchableOpacity onPress={() => console.log('tap!!')} style={styles.button}>
                <Text style={styles.buttonText}>Discover Another city</Text>
              </TouchableOpacity>
            </TriggeringView>
          </View>
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
