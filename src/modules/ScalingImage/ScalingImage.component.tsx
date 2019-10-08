import React from 'react';
import { View, ImageSourcePropType, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { ScrollConsumer } from '../../ScrollContext.tsx';

export interface Props {
  image: ImageSourcePropType;
  minHeight: number;
  maxHeight: number;
  style: ViewStyle;
  imageStyle: ImageStyle;
}

export class ScalingImage extends React.Component<Props> {
  renderContent = ({ scrollValue }) => {
    const { image, minHeight, maxHeight, style, imageStyle } = this.props;
    const scale = scrollValue.interpolate({
      inputRange: [0, 80],
      outputRange: [maxHeight / minHeight, 1],
      extrapolate: Animated.Extrapolate.CLAMP,
    });

    return (
      <View style={[styles.container, { height: minHeight, width: maxHeight }, style]}>
        <Animated.Image
          source={image}
          style={[
            {
              height: minHeight,
              width: minHeight,
              transform: [{ scale }],
              borderRadius: maxHeight / 2,
            },
            styles.image,
            imageStyle,
          ]}
        />
      </View>
    );
  };

  render() {
    return <ScrollConsumer>{this.renderContent}</ScrollConsumer>;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    position: 'absolute',
    bottom: 0,
  },
});
