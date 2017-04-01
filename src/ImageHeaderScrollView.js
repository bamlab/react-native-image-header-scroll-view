import React, { Component } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  } from 'react-native';
import _ from 'lodash';

const SCROLLVIEW_REF = 'ScrollView';

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
  blackOverlay: {
    backgroundColor: 'black',
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
});


class ImageHeaderScrollView extends Component {
  constructor(props) {
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
    return this[SCROLLVIEW_REF].getScrollResponder();
  }
  getScrollableNode() {
    return this.getScrollResponder().getScrollableNode();
  }
  getInnerViewNode() {
    return this.getScrollResponder().getInnerViewNode();
  }
  setNativeProps(props) {
    this[SCROLLVIEW_REF].setNativeProps(props);
  }
  scrollTo(...args) {
    this.getScrollResponder().scrollTo(...args);
  }

  interpolateOnImageHeight(outputRange) {
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

    return (
      <Animated.View style={[styles.header, headerTransformStyle]}>
        <Animated.View style={[styles.blackOverlay, { opacity: overlayOpacity }]} />
        <View style={styles.fixedForeground}>
          { this.props.renderFixedForeground(this.state.scrollY) }
        </View>
        { this.props.renderHeader(this.state.scrollY) }
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
        { this.props.renderForeground() }
      </Animated.View>
    );
  }

  render() {
    const scrollViewProps = _.pick(this.props, _.keys(ScrollView.propTypes));

    const headerScrollDistance = this.interpolateOnImageHeight([
      this.props.maxHeight,
      this.props.maxHeight - this.props.minHeight,
    ]);
    const topMargin = this.interpolateOnImageHeight([0, this.props.minHeight]);

    const childrenContainerStyle = StyleSheet.flatten([
      { transform: [{ translateY: headerScrollDistance }] },
      { backgroundColor: 'white', paddingBottom: this.props.maxHeight },
      this.props.childrenStyle,
    ]);

    return (
      <View
        style={styles.container}
        ref={(ref) => { this.container = ref; }}
        onLayout={() => this.container.measureInWindow((x, y) => this.setState({ pageY: y }))}
      >
        { this.renderHeader() }
        { this.renderForeground() }
        <Animated.View style={[styles.container, { transform: [{ translateY: topMargin }] }]}>
          <ScrollView
            ref={(ref) => { this[SCROLLVIEW_REF] = ref; }}
            style={styles.container}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            )}
            {...scrollViewProps}
          >
            <Animated.View style={childrenContainerStyle}>
              {this.props.children}
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

ImageHeaderScrollView.propTypes = {
  children: React.PropTypes.node || React.PropTypes.nodes,
  childrenStyle: View.propTypes.style,
  fadeOutForeground: React.PropTypes.bool,
  foregroundParallaxRatio: React.PropTypes.number,
  maxHeight: React.PropTypes.number,
  maxOverlayOpacity: React.PropTypes.number,
  minHeight: React.PropTypes.number,
  minOverlayOpacity: React.PropTypes.number,
  renderFixedForeground: React.PropTypes.func,
  renderForeground: React.PropTypes.func,
  renderHeader: React.PropTypes.func,
  ...ScrollView.propTypes,
};

ImageHeaderScrollView.defaultProps = {
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

ImageHeaderScrollView.childContextTypes = {
  scrollY: React.PropTypes.instanceOf(Animated.Value),
  scrollPageY: React.PropTypes.number,
};

export default ImageHeaderScrollView;
