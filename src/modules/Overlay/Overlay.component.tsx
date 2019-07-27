import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { FixedContentComponent } from '../FixedContent';

export interface Props {
  disableHeaderGrow?: boolean;
  containerStyle?: object;
  isBackground?: boolean;
  isForeground?: boolean;
  maxHeight?: number;
  minHeight?: number;
  maxOpacity?: number;
  minOpacity?: number;
  color?: string;
  scrollValue: Animated.Value<number>;
}

export class Overlay extends Component<Props> {
  static defaultProps = {
    color: 'black',
    maxOpacity: 0.3,
    minOpacity: 0,
  };

  interpolateOnImageHeight(outputRange: Array<number>) {
    const headerScrollDistance = this.props.maxHeight - this.props.minHeight;
    return this.props.scrollValue.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange,
      extrapolate: Animated.Extrapolate.CLAMP,
    });
  }

  renderOverlay = () => {
    const overlayOpacity = this.interpolateOnImageHeight([
      this.props.minOpacity,
      this.props.maxOpacity,
    ]);

    const overlayStyle = [
      styles.overlay,
      { opacity: overlayOpacity, backgroundColor: this.props.color },
    ];

    return <Animated.View style={overlayStyle} testID="overlay" />;
  };

  render() {
    return (
      <FixedContentComponent
        scrollValue={this.props.scrollValue}
        render={this.renderOverlay}
        minHeight={this.props.minHeight}
        maxHeight={this.props.maxHeight}
        isBackground={this.props.isBackground}
        isForeground={this.props.isForeground}
        disableHeaderGrow={this.props.disableHeaderGrow}
        testId="overlayContainer"
      />
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});
