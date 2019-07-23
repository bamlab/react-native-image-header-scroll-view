import React from 'react';
import { View } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';
import ImageHeaderScrollView from '../ImageHeaderScrollView';

import { getAnimatedValues } from '../testUtils';

const renderForeground = () => <View testID="user_foreground" />;
const renderHeader = () => <View testID="user_header" />;
const renderTouchableFixedForeground = () => <View testID="user_touchableForeground" />;
const renderFixedForeground = () => <View testID="user_fixedForeground" />;

describe('ImageHeaderScrollView', () => {
  it('render everything', () => {
    const renderer = render(
      <ImageHeaderScrollView
        maxHeight={200}
        minHeight={100}
        renderHeader={renderHeader}
        renderTouchableFixedForeground={renderTouchableFixedForeground}
        renderFixedForeground={renderFixedForeground}
        renderForeground={renderForeground}
      >
        <View style={{ height: 1000 }} testID="children" />
      </ImageHeaderScrollView>
    );

    renderer.getByTestId('scrollView');
    renderer.getByTestId('header');
    renderer.getByTestId('user_header');
    renderer.getByTestId('overlay');

    renderer.getByTestId('user_foreground');
    renderer.getByTestId('foreground');

    renderer.getByTestId('touchableForeground');
    renderer.getByTestId('user_touchableForeground');

    renderer.getByTestId('fixedForeground');
    renderer.getByTestId('user_fixedForeground');

    renderer.getByTestId('children');
  });

  it('should reduce the foreground height on scroll', () => {
    const renderer = render(
      <ImageHeaderScrollView
        maxHeight={200}
        minHeight={100}
        renderTouchableFixedForeground={renderTouchableFixedForeground}
      >
        <View style={{ height: 1000 }} />
      </ImageHeaderScrollView>
    );

    expect(getAnimatedValues(renderer.getByTestId('touchableForeground')).height).toBe(200);

    fireEvent.scroll(renderer.getByTestId('scrollView'), {
      nativeEvent: { contentOffset: { y: 50 } },
    });
    expect(getAnimatedValues(renderer.getByTestId('touchableForeground')).height).toBe(150);

    fireEvent.scroll(renderer.getByTestId('scrollView'), {
      nativeEvent: { contentOffset: { y: 500 } },
    });
    expect(getAnimatedValues(renderer.getByTestId('touchableForeground')).height).toBe(100);
  });

  it('should bounce the header on negavite scroll', () => {
    const renderer = render(
      <ImageHeaderScrollView maxHeight={200} minHeight={100} renderHeader={renderHeader}>
        <View style={{ height: 1000 }} />
      </ImageHeaderScrollView>
    );

    expect(getAnimatedValues(renderer.getByTestId('header')).scale).toBe(1);

    fireEvent.scroll(renderer.getByTestId('scrollView'), {
      nativeEvent: { contentOffset: { y: -50 } },
    });
    expect(getAnimatedValues(renderer.getByTestId('header')).scale).toBe(1.5);

    fireEvent.scroll(renderer.getByTestId('scrollView'), {
      nativeEvent: { contentOffset: { y: 500 } },
    });
    expect(getAnimatedValues(renderer.getByTestId('header')).scale).toBe(1);
  });

  it('should cancel bounce on disableHeaderGrow', () => {
    const renderer = render(
      <ImageHeaderScrollView
        maxHeight={200}
        minHeight={100}
        renderHeader={renderHeader}
        disableHeaderGrow
      >
        <View style={{ height: 1000 }} />
      </ImageHeaderScrollView>
    );

    expect(getAnimatedValues(renderer.getByTestId('header')).scale).toBeUndefined();
    fireEvent.scroll(renderer.getByTestId('scrollView'), {
      nativeEvent: { contentOffset: { y: -50 } },
    });
    expect(getAnimatedValues(renderer.getByTestId('header')).scale).toBeUndefined();
  });

  it('should move the foreground on scroll', () => {
    const renderer = render(
      <ImageHeaderScrollView
        maxHeight={200}
        minHeight={100}
        renderHeader={renderHeader}
        renderForeground={renderForeground}
      >
        <View style={{ height: 1000 }} />
      </ImageHeaderScrollView>
    );

    expect(getAnimatedValues(renderer.getByTestId('foreground')).translateY).toBe(0);
    fireEvent.scroll(renderer.getByTestId('scrollView'), {
      nativeEvent: { contentOffset: { y: 50 } },
    });
    expect(getAnimatedValues(renderer.getByTestId('foreground')).translateY).toBe(-50);
    fireEvent.scroll(renderer.getByTestId('scrollView'), {
      nativeEvent: { contentOffset: { y: 500 } },
    });
    expect(getAnimatedValues(renderer.getByTestId('foreground')).translateY).toBe(-400);
  });

  it('should use the foregroundParallaxRatio', () => {
    const renderer = render(
      <ImageHeaderScrollView
        maxHeight={200}
        minHeight={100}
        renderHeader={renderHeader}
        renderForeground={renderForeground}
        foregroundParallaxRatio={3}
      >
        <View style={{ height: 1000 }} />
      </ImageHeaderScrollView>
    );

    expect(getAnimatedValues(renderer.getByTestId('foreground')).translateY).toBe(0);
    fireEvent.scroll(renderer.getByTestId('scrollView'), {
      nativeEvent: { contentOffset: { y: 50 } },
    });
    expect(getAnimatedValues(renderer.getByTestId('foreground')).translateY).toBe(-150);
    fireEvent.scroll(renderer.getByTestId('scrollView'), {
      nativeEvent: { contentOffset: { y: 500 } },
    });
    expect(getAnimatedValues(renderer.getByTestId('foreground')).translateY).toBe(-1200);
  });

  it('should have scrollView like methods', () => {
    let component;
    render(
      <ImageHeaderScrollView
        maxHeight={200}
        minHeight={100}
        renderHeader={renderHeader}
        renderTouchableFixedForeground={renderTouchableFixedForeground}
        renderFixedForeground={renderFixedForeground}
        renderForeground={renderForeground}
        ref={ref => {
          component = ref;
        }}
      >
        <View style={{ height: 1000 }} testID="children" />
      </ImageHeaderScrollView>
    );
    expect(component.scrollTo).not.toBeUndefined();
  });
});
