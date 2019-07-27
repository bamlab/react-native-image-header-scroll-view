import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

export interface Props {
  disableHeaderGrow?: boolean;
  headerContainerStyle?: object;
  isBackground?: boolean;
  isForeground?: boolean;
  maxHeight?: number;
  minHeight?: number;
  render?: () => React.ReactElement;
  scrollValue: Animated.Value<number>;
  testId?: string;
}

export class FixedContent extends Component<Props> {
  static defaultProps = {
    disableHeaderGrow: false,
    maxHeight: 125,
    minHeight: 80,
    render: () => <View />,
  };

  render() {
    const { scrollValue } = this.props;
    const headerScale = scrollValue.interpolate({
      inputRange: [-this.props.maxHeight, 0],
      outputRange: [3, 1],
      extrapolate: Animated.Extrapolate.CLAMP,
    });

    let height: ReturnType<typeof scrollValue.interpolate> | number = this.props.maxHeight;

    if (this.props.isForeground && this.props.minHeight) {
      const headerScrollDistance = this.props.maxHeight - this.props.minHeight;
      height = scrollValue.interpolate({
        inputRange: [0, headerScrollDistance],
        outputRange: [this.props.maxHeight, this.props.minHeight],
        extrapolate: Animated.Extrapolate.CLAMP,
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
