// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, ScrollView, StyleSheet, View, Platform } from 'react-native';
import type { ViewProps } from 'ViewPropTypes';
import type { FlatList, SectionList, ListView } from 'react-native';

type ScrollViewProps = {
  onScroll?: ?Function,
  style?: $PropertyType<ViewProps, 'style'>,
  contentContainerStyle?: $PropertyType<ViewProps, 'style'>,
  scrollEventThrottle: number,
};

export type Props = ScrollViewProps & {
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
  renderForeground?: () => React$Element<any>,
  renderHeader: () => React$Element<any>,
  renderTouchableFixedForeground?: ?() => React$Element<any>,
  ScrollViewComponent: React$ComponentType<ScrollViewProps>,
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
  renderHeader: () => React$Element<any>,
  ScrollViewComponent: React$ComponentType<ScrollViewProps>,
};

export type State = {
  scrollY: Animated.Value,
  pageY: number,
};

type ScrollComponent<ItemT> = FlatList<ItemT> | SectionList<ItemT> | ListView | ScrollView;

class ImageHeaderScrollView extends Component<Props, State> {
  container: ?View; // @see https://github.com/facebook/react-native/issues/15955
  scrollViewRef: ?ScrollComponent<any>; // @see https://github.com/facebook/react-native/issues/15955
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
    renderHeader: () => <View />,
    ScrollViewComponent: ScrollView,
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

    if (!this.props.renderForeground) {
      return <View />;
    }

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

  onScroll = (e: *) => {
    if (this.props.onScroll) {
      this.props.onScroll(e);
    }
    const scrollY = e.nativeEvent.contentOffset.y;
    this.state.scrollY.setValue(scrollY);
  };

  render() {
    /* eslint-disable no-unused-vars */
    const {
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
      contentContainerStyle,
      onScroll,
      ScrollViewComponent,
      ...scrollViewProps
    } = this.props;
    /* eslint-enable no-unused-vars */

    const inset = maxHeight - minHeight;

    return (
      <View
        style={[styles.container, { paddingTop: minHeight }]}
        ref={ref => (this.container = ref)}
        onLayout={this.onContainerLayout}
      >
        {this.renderHeader()}
        <ScrollViewComponent
          ref={ref => (this.scrollViewRef = ref)}
          scrollEventThrottle={16}
          overScrollMode="never"
          {...scrollViewProps}
          contentContainerStyle={[
            {
              backgroundColor: 'white',
              marginTop: inset,
              paddingBottom: inset,
            },
            contentContainerStyle,
            childrenStyle,
          ]}
          style={[styles.container, style]}
          onScroll={this.onScroll}
        />
        {this.renderTouchableFixedForeground()}
        {this.renderForeground()}
      </View>
    );
  }

  /*
   * Expose `ScrollView` API so this component is composable
   * with any component that expects a `ScrollView`.
   */
  getScrollableNode(): any {
    const responder = this.getScrollResponder();
    if (!responder) {
      return;
    }
    return responder.getScrollableNode();
  }
  getInnerViewNode(): any {
    const responder = this.getScrollResponder();
    if (!responder) {
      return;
    }
    return responder.getInnerViewNode();
  }

  scrollTo(
    y?: number | { x?: number, y?: number, animated?: boolean },
    x?: number,
    animated?: boolean
  ) {
    const responder = this.getScrollResponder();
    if (!responder) {
      return;
    }
    responder.scrollTo(y, x, animated);
  }

  scrollToEnd(params?: ?{ animated?: ?boolean }) {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.scrollToEnd &&
      typeof this.scrollViewRef.scrollToEnd === 'function'
    ) {
      this.scrollViewRef.scrollToEnd(params);
    }
  }

  getScrollResponder(): ?ScrollView {
    if (this.scrollViewRef && this.scrollViewRef.getScrollResponder) {
      return this.scrollViewRef.getScrollResponder();
    }
  }

  setNativeProps(props: Object) {
    if (this.scrollViewRef && this.scrollViewRef.setNativeProps) {
      this.scrollViewRef.setNativeProps(props);
    }
  }

  recordInteraction() {
    if (this.scrollViewRef && this.scrollViewRef.recordInteraction) {
      this.scrollViewRef.recordInteraction();
    }
  }

  flashScrollIndicators() {
    if (this.scrollViewRef && this.scrollViewRef.flashScrollIndicators) {
      this.scrollViewRef.flashScrollIndicators();
    }
  }

  getMetrics(): ?Object {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.getMetrics &&
      typeof this.scrollViewRef.getMetrics === 'function'
    ) {
      return this.scrollViewRef.getMetrics();
    }
  }

  /**
   * Expose `FlatList` API so this component is composable
   * with any component that expects a `FlatList`.
   */
  scrollToIndex(params: {
    animated?: ?boolean,
    index: number,
    viewOffset?: number,
    viewPosition?: number,
  }) {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.scrollToIndex &&
      typeof this.scrollViewRef.scrollToIndex === 'function'
    ) {
      this.scrollViewRef.scrollToIndex(params);
    }
  }

  scrollToItem(params: { animated?: ?boolean, item: any, viewPosition?: number }) {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.scrollToItem &&
      typeof this.scrollViewRef.scrollToItem === 'function'
    ) {
      this.scrollViewRef.scrollToItem(params);
    }
  }

  scrollToOffset(params: { animated?: ?boolean, offset: number }) {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.scrollToOffset &&
      typeof this.scrollViewRef.scrollToOffset === 'function'
    ) {
      this.scrollViewRef.scrollToOffset(params);
    }
  }

  /**
   * Expose `SectionList` API so this component is composable
   * with any component that expects a `SectionList`.
   */
  scrollToLocation(params: {
    animated?: ?boolean,
    itemIndex: number,
    sectionIndex: number,
    viewOffset?: number,
    viewPosition?: number,
  }) {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.scrollToLocation &&
      typeof this.scrollViewRef.scrollToLocation === 'function'
    ) {
      this.scrollViewRef.scrollToLocation(params);
    }
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
