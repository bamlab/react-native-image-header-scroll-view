import React, { Component } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  } from 'react-native';

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
});


class ImageHeaderScrollView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
    };
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
    const headerHeight = this.interpolateOnImageHeight([
      this.props.maxHeight,
      this.props.minHeight,
    ]);
    const overlayOpacity = this.interpolateOnImageHeight([
      this.props.minOverlayOpacity,
      this.props.maxOverlayOpacity,
    ]);

    const headerScale = this.state.scrollY.interpolate({
      inputRange: [-this.props.maxHeight, 0],
      outputRange: [3, 1],
      extrapolate: 'clamp',
    });

    const headerTransformStyle = { height: headerHeight, transform: [{ scale: headerScale }] };
    return (
      <Animated.View style={[styles.header, headerTransformStyle]}>
        <Animated.View style={[styles.blackOverlay, { opacity: overlayOpacity }]} />
        { this.props.renderHeader() }
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
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
          )}
        >
          <Animated.View style={[{ paddingTop: this.props.maxHeight }, this.props.childrenStyle]}>
            {this.props.children}
          </Animated.View>
        </ScrollView>
        { this.renderHeader() }
        { this.renderForeground() }
      </View>
    );
  }
}

ImageHeaderScrollView.propTypes = {
  renderHeader: React.PropTypes.func,
  renderForeground: React.PropTypes.func,
  maxHeight: React.PropTypes.number,
  minHeight: React.PropTypes.number,
  children: React.PropTypes.node || React.PropTypes.nodes,
  maxOverlayOpacity: React.PropTypes.number,
  minOverlayOpacity: React.PropTypes.number,
  childrenStyle: View.propTypes.style,
  foregroundParallaxRatio: React.PropTypes.number,
  fadeOutForeground: React.PropTypes.bool,
};

ImageHeaderScrollView.defaultProps = {
  maxHeight: 125,
  minHeight: 80,
  maxOverlayOpacity: 0.3,
  minOverlayOpacity: 0,
  renderHeader: () => <View />,
  renderForeground: () => <View />,
  foregroundParallaxRatio: 1,
  fadeOutForeground: false,
};

export default ImageHeaderScrollView;
