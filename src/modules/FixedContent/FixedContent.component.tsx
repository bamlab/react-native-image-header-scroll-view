import React, { Component } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

export interface Props {
  disableHeaderGrow?: boolean;
  headerContainerStyle?: object;
  isBackground?: boolean;
  isForeground?: boolean;
  maxHeight?: number;
  minHeight?: number;
  renderHeader?: () => React.ReactElement;
  scrollValue: Animated.Value;
  testId?: string;
}

export class FixedContent extends Component<Props> {
  static defaultProps = {
    disableHeaderGrow: false,
    maxHeight: 125,
    minHeight: 80,
    renderHeader: () => <View />,
  };

  render() {
    const headerScale = this.props.scrollValue.interpolate({
      inputRange: [-this.props.maxHeight, 0],
      outputRange: [3, 1],
      extrapolate: 'clamp',
    });

    let height: Animated.AnimatedInterpolation | number = this.props.maxHeight;

    if (this.props.isForeground && this.props.minHeight) {
      const headerScrollDistance = this.props.maxHeight - this.props.minHeight;
      height = this.props.scrollValue.interpolate({
        inputRange: [0, headerScrollDistance],
        outputRange: [this.props.maxHeight, this.props.minHeight],
        extrapolate: 'clamp',
      });
    }

    const headerTransformStyle = {
      height,
      transform: !this.props.disableHeaderGrow ? [{ scale: headerScale }] : undefined,
    };

    return (
      <Animated.View
        style={[styles.header, headerTransformStyle, this.props.headerContainerStyle]}
        testID={this.props.testId || 'header'}
      >
        {this.props.renderHeader()}
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
