import React, { Component } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';

export interface Props {
  extrapolate?: 'extend' | 'identity' | 'clamp';
  height?: number;
  isBackground?: boolean;
  isForeground?: boolean;
  parallaxRatio?: number;
  render: () => React.ReactElement;
  scrollValue: Animated.Value;
  style?: ViewStyle;
}

export class MovingContent extends Component<Props> {
  static defaultProps = {
    height: 500,
    foregroundParallaxRatio: 1,
    extrapolate: 'clamp',
  };

  render() {
    const headerTranslate = this.props.scrollValue.interpolate({
      inputRange: [0, this.props.height * 2],
      outputRange: [0, -this.props.height * 2 * this.props.parallaxRatio],
      extrapolate: this.props.extrapolate,
    });

    const headerTransformStyle = {
      height: this.props.height,
      transform: [{ translateY: headerTranslate }],
    };

    if (!this.props.render) {
      return <View />;
    }

    return (
      <Animated.View
        style={[styles.header, headerTransformStyle, this.props.style]}
        testID="foreground"
      >
        {this.props.render()}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
});
