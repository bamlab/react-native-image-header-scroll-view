// @flow
import React from 'react';
import PropTypes from 'prop-types';
import ScrollViewLike from '../ScrollViewLike';
import {
  ScrollViewProps,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Animated,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

interface ModuleProps {
  scrollValue: Animated.Value;
  isBackground?: boolean;
  isForeground?: boolean;
}

interface Props extends ScrollViewProps {
  children?: React.ReactElement;
  childrenStyle?: ViewStyle | TextStyle | ImageStyle;
  maxHeight: number; // default is 80
  minHeight: number; // default is 125
  ScrollViewComponent: React.ComponentType<ScrollViewProps>;
  scrollViewBackgroundColor: string; // defaults to white.
  useNativeDriver?: boolean; // defaults to false.
  backgroundComponents: Array<React.ComponentType<ModuleProps>>;
  foregroundComponents: Array<React.ComponentType<ModuleProps>>;
}

interface State {
  scrollY: Animated.Value;
  pageY: number;
}

class ImageHeaderScrollView extends ScrollViewLike<Props, State> {
  container?: any; // @see https://github.com/facebook/react-native/issues/15955
  state: State;

  static defaultProps = {
    ScrollViewComponent: ScrollView,
    scrollViewBackgroundColor: 'white',
    backgroundComponents: [],
    foregroundComponents: [],
  };

  static childContextTypes = {
    scrollY: PropTypes.instanceOf(Animated.Value),
    scrollPageY: PropTypes.number,
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

  onScroll = e => {
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
      maxHeight,
      minHeight,
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
        {this.props.backgroundComponents.map(
          (Component, index) =>
            !!Component && <Component scrollValue={this.state.scrollY} isBackground key={index} />
        )}
        <ScrollViewComponent
          scrollEventThrottle={useNativeDriver ? 1 : 16}
          ref={this.setScrollViewRef}
          overScrollMode="never"
          testID="scrollView"
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
        {this.props.foregroundComponents.map(
          (Component, index) =>
            !!Component && <Component scrollValue={this.state.scrollY} isForeground key={index} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ImageHeaderScrollView;

