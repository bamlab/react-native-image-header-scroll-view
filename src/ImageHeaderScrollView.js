// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import type { ViewProps } from 'ViewPropTypes';

export type Props = {
  children?: ?React$Element<any>,
  childrenStyle?: ?any,
  overlayColor: string,
  fadeOutForeground: boolean,
  foregroundParallaxRatio: number,
  maxHeight: number,
  maxOverlayOpacity: number,
  minHeight: number,
  minOverlayOpacity: number,
  renderFixedForeground: () => React$Element<any>,
  renderForeground: () => React$Element<any>,
  renderHeader: () => React$Element<any>,
  renderTouchableFixedForeground?: ?() => React$Element<any>,
  style?: $PropertyType<ViewProps, 'style'>,
  onScroll?: ?Function,
};

export type DefaultProps = {
  overlayColor: string,
  fadeOutForeground: boolean,
  foregroundParallaxRatio: number,
  maxHeight: number,
  maxOverlayOpacity: number,
  minHeight: number,
  minOverlayOpacity: number,
  renderFixedForeground: () => React$Element<any>,
  renderForeground: () => React$Element<any>,
  renderHeader: () => React$Element<any>,
};

export type State = {
  scrollY: Animated.Value,
  pageY: number,
};

class ImageHeaderScrollView extends Component<Props, State> {
  container: ?View; // @see https://github.com/facebook/react-native/issues/15955
  scrollViewRef: ?ScrollView; // @see https://github.com/facebook/react-native/issues/15955
  state: State;

  static defaultProps: DefaultProps = {
    overlayColor: 'black',
    fadeOutForeground: false,
    foregroundParallaxRatio: 1,
    maxHeight: 125,
    maxOverlayOpacity: 0.3,
    minHeight: 80,
    minOverlayOpacity: 0,
    renderFixedForeground: () => <View />,
    renderForeground: () => <View />,
    renderHeader: () => <View />,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      pageY: 0,
    };
  }

  getChildContext() {
    return {
      scrollY: this.state.scrollY,
      scrollPageY: this.state.pageY + this.props.minHeight,
    };
  }

  /*
   * Expose `ScrollView` API so this component is composable
   * with any component that expects a `ScrollView`.
   */
  getScrollResponder() {
    if (!this.scrollViewRef) {
      return;
    }
    return this.scrollViewRef.getScrollResponder();
  }
  getScrollableNode() {
    const responder = this.getScrollResponder();
    if (!responder) {
      return;
    }
    return responder.getScrollableNode();
  }
  getInnerViewNode() {
    const responder = this.getScrollResponder();
    if (!responder) {
      return;
    }
    return responder.getInnerViewNode();
  }
  setNativeProps(props: Props) {
    if (!this.scrollViewRef) {
      return;
    }
    this.scrollViewRef.setNativeProps(props);
  }
  scrollTo(...args: *) {
    const responder = this.getScrollResponder();
    if (!responder) {
      return;
    }
    responder.scrollTo(...args);
  }

  interpolateOnImageHeight(outputRange: Array<number>) {
    const headerScrollDistance = this.props.maxHeight - this.props.minHeight;
    return this.state.scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange,
      extrapolate: 'clamp',
    });
  }

  renderHeader() {
    const overlayOpacity = this.interpolateOnImageHeight([
      this.props.minOverlayOpacity,
      this.props.maxOverlayOpacity,
    ]);

    const headerScale = this.state.scrollY.interpolate({
      inputRange: [-this.props.maxHeight, 0],
      outputRange: [3, 1],
      extrapolate: 'clamp',
    });

    const headerTransformStyle = {
      height: this.props.maxHeight,
      transform: [{ scale: headerScale }],
    };

    const overlayStyle = [
      styles.overlay,
      { opacity: overlayOpacity, backgroundColor: this.props.overlayColor },
    ];

    return (
      <Animated.View style={[styles.header, headerTransformStyle]}>
        {this.props.renderHeader()}
        <Animated.View style={overlayStyle} />
        <View style={styles.fixedForeground}>{this.props.renderFixedForeground()}</View>
      </Animated.View>
    );
  }

  renderForeground() {
    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, this.props.maxHeight * 2],
      outputRange: [0, -this.props.maxHeight * 2 * this.props.foregroundParallaxRatio],
      extrapolate: 'clamp',
    });
    const opacity = this.interpolateOnImageHeight([1, -0.3]);

    const headerTransformStyle = {
      height: this.props.maxHeight,
      transform: [{ translateY: headerTranslate }],
      opacity: this.props.fadeOutForeground ? opacity : 1,
    };
    return (
      <Animated.View style={[styles.header, headerTransformStyle]}>
        {this.props.renderForeground()}
      </Animated.View>
    );
  }

  renderTouchableFixedForeground() {
    const height = this.interpolateOnImageHeight([this.props.maxHeight, this.props.minHeight]);

    const headerScale = this.state.scrollY.interpolate({
      inputRange: [-this.props.maxHeight, 0],
      outputRange: [3, 1],
      extrapolate: 'clamp',
    });

    const headerTransformStyle = {
      height,
      transform: [{ scale: headerScale }],
    };

    if (!this.props.renderTouchableFixedForeground) {
      return <View />;
    }

    return (
      <Animated.View style={[styles.header, styles.touchableFixedForeground, headerTransformStyle]}>
        {this.props.renderTouchableFixedForeground()}
      </Animated.View>
    );
  }

  onContainerLayout = () => {
    if (!this.container) {
      return;
    }
    this.container.measureInWindow((x, y) => this.setState(() => ({ pageY: y })));
  };

  render() {
    /* eslint-disable no-unused-vars */
    const {
      children,
      childrenStyle,
      overlayColor,
      fadeOutForeground,
      foregroundParallaxRatio,
      maxHeight,
      maxOverlayOpacity,
      minHeight,
      minOverlayOpacity,
      renderFixedForeground,
      renderForeground,
      renderHeader,
      renderTouchableFixedForeground,
      style,
      onScroll,
      ...scrollViewProps
    } = this.props;
    /* eslint-enable no-unused-vars */

    const headerScrollDistance = this.interpolateOnImageHeight([maxHeight, maxHeight - minHeight]);
    const topMargin = this.interpolateOnImageHeight([0, minHeight]);

    const childrenContainerStyle = StyleSheet.flatten([
      { transform: [{ translateY: headerScrollDistance }] },
      { backgroundColor: 'white', paddingBottom: maxHeight },
      childrenStyle,
    ]);

    return (
      <View
        style={styles.container}
        ref={ref => (this.container = ref)}
        onLayout={this.onContainerLayout}
      >
        {this.renderHeader()}
        <Animated.View style={[styles.container, { transform: [{ translateY: topMargin }] }]}>
          <ScrollView
            ref={ref => (this.scrollViewRef = ref)}
            scrollEventThrottle={16}
            {...scrollViewProps}
            style={[styles.container, style]}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              {
                listener: onScroll,
              }
            )}
          >
            <Animated.View style={childrenContainerStyle}>{children}</Animated.View>
          </ScrollView>
        </Animated.View>
        {this.renderTouchableFixedForeground()}
        {this.renderForeground()}
      </View>
    );
  }
}

ImageHeaderScrollView.childContextTypes = {
  scrollY: PropTypes.instanceOf(Animated.Value),
  scrollPageY: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  headerChildren: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
  },
  fixedForeground: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 101,
  },
  touchableFixedForeground: {
    zIndex: 102,
  },
});

export default ImageHeaderScrollView;
