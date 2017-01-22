import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, StatusBar, View, Dimensions } from 'react-native';
import { withNavigation } from '@exponent/ex-navigation';
import { Router } from '../main';

import tvShowContent from '../assets/tvShowContent';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'stretch',
    padding: 30,
  },
  button: {
    height: 100,
    width: Dimensions.get('window').width - 60,
    backgroundColor: '#cccccc',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

console.log(Router);

@withNavigation
class Button extends React.Component {
  render() {
    const props = this.props;
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => {
        this.props.navigator.push(Router.getRoute(props.target));
      }}>
        <Image style={styles.button} source={props.image}>
          <View style={styles.overlay}>
            <Text style={styles.buttonText}>{ props.text }</Text>
          </View>
        </Image>
      </TouchableOpacity>
    );
  }
}

const Menu = () => (
  <View style={styles.page}>
    <StatusBar />
    <Button image={tvShowContent.image} text="TV Show" target="tvShow" />
  </View>
);

Menu.route = {
  navigationBar: {
    title: 'ImageHeaderScrollView',
  },
};

export default Menu;
