// @flow
import React from 'react';
import { ImageStyle, ScrollView, ScrollViewProps, TextStyle, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import AnimatedScrollView from './components/AnimatedScrollView';
import { fixedContent, fixedImage } from './modules/FixedContent';
import { overlay } from './modules/Overlay';
import { movingContent } from './modules/MovingContent';
import ScrollViewLike from './ScrollViewLike';

interface Dictionary {
  [key: string]: string;
}
interface SourceObjectProps {
  uri?: string;
  bundle?: string;
  method?: string;
  headers?: Dictionary;
  body?: string;
  cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached';
  width?: number;
  height?: number;
  scale?: number;
}

type SourceProps = number | SourceObjectProps | SourceObjectProps[];

interface Props extends ScrollViewProps {
  children?: React.ReactElement;
  childrenStyle?: ViewStyle | TextStyle | ImageStyle;
  overlayColor?: string; // defaults to black
  fadeOutForeground: boolean;
  foregroundParallaxRatio: number; // defaults to 1
  maxHeight?: number; // default is 80
  minHeight?: number; // default is 125
  maxOverlayOpacity?: number; // defaults to 0.3
  minOverlayOpacity?: number; // defaults to 0
  renderFixedForeground: () => React.ReactElement;
  renderForeground?: () => React.ReactElement;
  renderHeader?: () => React.ReactElement; // default is an empty view.
  foregroundExtrapolate: Animated.Extrapolate;
  renderTouchableFixedForeground?: () => React.ReactElement;
  ScrollViewComponent: React.ComponentType<ScrollViewProps>;
  scrollViewBackgroundColor: string; // defaults to white.
  headerImage?: SourceProps;
  useNativeDriver?: boolean; // defaults to false.
  headerContainerStyle?: object;
  fixedForegroundContainerStyles?: object;
  disableHeaderGrow?: boolean;
}

class ImageHeaderScrollView extends ScrollViewLike<Props, {}> {
  static defaultProps = {
    fadeOutForeground: false,
    foregroundParallaxRatio: 1,
    renderFixedForeground: () => <View />,
    foregroundExtrapolate: 'clamp',
    ScrollViewComponent: ScrollView,
    scrollViewBackgroundColor: 'white',
  };

  render() {
    const {
      disableHeaderGrow,
      fixedForegroundContainerStyles,
      headerContainerStyle,
      headerImage,
      maxHeight,
      minHeight,
      maxOverlayOpacity,
      minOverlayOpacity,
      overlayColor,
      renderFixedForeground,
      renderHeader,
      foregroundExtrapolate,
      foregroundParallaxRatio,
      renderForeground,
      ...rest
    } = this.props;

    const disableOverlay = minOverlayOpacity === maxOverlayOpacity && maxOverlayOpacity === 0;
    const contentOptions = {
      disableHeaderGrow,
      headerContainerStyle,
      maxHeight,
      minHeight,
    };

    return (
      <AnimatedScrollView
        backgroundComponents={[
          headerImage
            ? fixedImage({ ...contentOptions, headerImage })
            : fixedContent({ ...contentOptions, renderHeader }),
          !disableOverlay
            ? overlay({
                disableHeaderGrow,
                containerStyle: headerContainerStyle,
                maxHeight,
                minHeight,
                maxOpacity: maxOverlayOpacity,
                minOpacity: minOverlayOpacity,
                color: overlayColor,
              })
            : null,
          fixedContent({
            ...contentOptions,
            renderHeader: renderFixedForeground,
            headerContainerStyle: fixedForegroundContainerStyles,
            testId: 'fixedForeground',
          }),
        ]}
        foregroundComponents={[
          this.props.renderTouchableFixedForeground
            ? fixedContent({
                disableHeaderGrow: true,
                maxHeight,
                minHeight,
                renderHeader: this.props.renderTouchableFixedForeground,
                testId: 'touchableForeground',
              })
            : null,
          movingContent({
            extrapolate: foregroundExtrapolate,
            height: maxHeight,
            parallaxRatio: foregroundParallaxRatio,
            render: renderForeground,
          }),
        ]}
        maxHeight={maxHeight}
        minHeight={minHeight}
        {...rest}
        ref={this.setScrollViewRef}
      />
    );
  }
}
export default ImageHeaderScrollView;
