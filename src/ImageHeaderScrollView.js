// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, ScrollView, StyleSheet, View, Image, Dimensions } from 'react-native';
import type { ViewProps } from 'ViewPropTypes';
import type { FlatList, SectionList, ListView } from 'react-native';

type ScrollViewProps = {
  onScroll?: ?Function,
  style?: $PropertyType<ViewProps, 'style'>,
  contentContainerStyle?: $PropertyType<ViewProps, 'style'>,
  scrollEventThrottle?: number,
};

type SourceObjectProps = {
  uri?: ?string,
  bundle?: ?string,
  method?: ?string,
  headers?: ?{ [string]: string },
  body?: ?string,
  cache?: ?('default' | 'reload' | 'force-cache' | 'only-if-cached'),
  width?: ?number,
  height?: ?number,
  scale?: ?number,
};
type SourceProps = number | SourceObjectProps | SourceObjectProps[];

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
  foregroundExtrapolate: ?string,
  renderTouchableFixedForeground?: ?() => React$Element<any>,
  ScrollViewComponent: React$ComponentType<ScrollViewProps>,
  scrollViewBackgroundColor: string,
  headerImage?: ?SourceProps,
  useNativeDriver: ?boolean,
  headerContainerStyle?: ?Object,
  fixedForegroundContainerStyles?: ?Object,
  disableHeaderGrow?: ?boolean,
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
  foregroundExtrapolate: string,
  ScrollViewComponent: React$ComponentType<ScrollViewProps>,
  scrollViewBackgroundColor: string,
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
    disableHeaderGrow: false,
    fadeOutForeground: false,
    foregroundParallaxRatio: 1,
    maxHeight: 125,
    maxOverlayOpacity: 0.3,
    minHeight: 80,
    minOverlayOpacity: 0,
    renderFixedForeground: () => <View />,
    foregroundExtrapolate: 'clamp',
    renderHeader: () => <View />,
    ScrollViewComponent: ScrollView,
    scrollViewBackgroundColor: 'white',
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

  renderHeaderProps() {
    if (this.props.headerImage) {
      return (
        <Image
          source={this.props.headerImage}
          style={{
            height: this.props.maxHeight,
            width: Dimensions.get('window').width,
          }}
        />
      );
    }
    return this.props.renderHeader();
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
      transform: !this.props.disableHeaderGrow ? [{ scale: headerScale }] : undefined,
    };

    const overlayStyle = [
      styles.overlay,
      { opacity: overlayOpacity, backgroundColor: this.props.overlayColor },
    ];

    const disableOverlay =
      this.props.minOverlayOpacity === this.props.maxOverlayOpacity &&
      this.props.maxOverlayOpacity === 0;

    return (
      <Animated.View style={[styles.header, headerTransformStyle, this.props.headerContainerStyle]}>
        {this.renderHeaderProps()}
        {!disableOverlay && <Animated.View style={overlayStyle} />}
        <View style={[styles.fixedForeground, this.props.fixedForegroundContainerStyles]}>
          {this.props.renderFixedForeground()}
        </View>
      </Animated.View>
    );
  }

  renderForeground() {
    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, this.props.maxHeight * 2],
      outputRange: [0, -this.props.maxHeight * 2 * this.props.foregroundParallaxRatio],
      extrapolate: this.props.foregroundExtrapolate,
    });

    const headerTransformStyle = {
      height: this.props.maxHeight,
      transform: [{ translateY: headerTranslate }],
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

    if (!this.props.renderTouchableFixedForeground) {
      return <View />;
    }

    if (this.props.useNativeDriver) {
      if (__DEV__) {
        console.warn(
          'useNativeDriver=true and renderTouchableFixedForeground is not supported at the moment due to the animation of height unsupported with the native driver'
        );
      }
      return null;
    }

    return (
      <Animated.View style={[styles.header, styles.touchableFixedForeground, { height }]}>
        {this.props.renderTouchableFixedForeground()}
      </Animated.View>
    );
  }

  onContainerLayout = () => {
    if (!this.container) {
      return;
    }
    this.container.measureInWindow((x, y) => {
      if (this.container) {
        this.setState(() => ({ pageY: y }));
      }
    });
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
      scrollViewBackgroundColor,
      useNativeDriver,
      ...scrollViewProps
    } = this.props;
    /* eslint-enable no-unused-vars */

    const ScrollViewComponent = useNativeDriver
      ? Animated.ScrollView
      : this.props.ScrollViewComponent;

    const inset = maxHeight - minHeight;

    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: minHeight,
            backgroundColor: scrollViewBackgroundColor,
          },
        ]}
        ref={ref => {
          this.container = ref;
        }}
        onLayout={this.onContainerLayout}
      >
        {this.renderHeader()}
        <ScrollViewComponent
          scrollEventThrottle={useNativeDriver ? 1 : 16}
          ref={ref => {
            this.scrollViewRef = ref;
          }}
          overScrollMode="never"
          {...scrollViewProps}
          contentContainerStyle={[
            {
              backgroundColor: scrollViewBackgroundColor,
              marginTop: inset,
              paddingBottom: inset,
            },
            contentContainerStyle,
            childrenStyle,
          ]}
          style={[styles.container, style]}
          onScroll={
            useNativeDriver
              ? Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
                  useNativeDriver: true,
                })
              : this.onScroll
          }
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
