import React, { FunctionComponent, MutableRefObject, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, ViewProps } from 'react-native';

interface Props extends ViewProps {
  onBeginHidden: Function;
  onHide: Function;
  onBeginDisplayed: Function;
  onDisplay: Function;
  onTouchTop: Function;
  onTouchBottom: Function;
  bottomOffset?: number;
  topOffset?: number;
}

type Context = {
  scrollPageY?: number;
  scrollY: Animated.Value;
};

export const TriggeringView: FunctionComponent<Props> = ({
  topOffset = 0,
  bottomOffset = 0,
  onDisplay,
  onBeginDisplayed,
  onHide,
  onBeginHidden,
  onTouchBottom,
  onTouchTop,
  onLayout,
  children,
  ...viewProps
}) => {
  const [initialPageY, setInitialPageY] = useState(0);
  const ref = useRef<MutableRefObject<View>>(null).current;
  const [touched, setTouched] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [context, setContext] = useState<Context>({
    scrollPageY: 0,
    scrollY: new Animated.Value(0),
  });

  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!context.scrollY) {
      return;
    }
    const listenerId = context.scrollY.addListener(onScroll);

    return () => {
      context.scrollY.removeListener(listenerId);
    };
  }, []);

  const handleOnLayout = (e: any) => {
    if (onLayout) {
      onLayout(e);
    }
    if (!ref) {
      return;
    }
    const layout = e.nativeEvent.layout;
    setHeight(layout.height);

    ref.current.measure((_x, _y, _width, _height, _ageX, pageY) => {
      setInitialPageY(pageY);
    });
  };

  const onScroll = (event: any) => {
    if (!context.scrollPageY) {
      return;
    }
    const pageY = initialPageY - event.value;
    triggerEvents(context.scrollPageY, pageY, pageY + height);
  };

  const triggerEvents = (value: number, top: number, bottom: number) => {
    if (!touched && value >= top + topOffset) {
      setTouched(true);
      onBeginHidden();
      onTouchTop(true);
    } else if (touched && value < top + topOffset) {
      setTouched(false);

      onDisplay();
      onTouchTop(false);
    }

    if (!hidden && value >= bottom + bottomOffset) {
      setHidden(true);
      onHide();
      onTouchBottom(true);
    } else if (hidden && value < bottom + bottomOffset) {
      setHidden(false);
      onBeginDisplayed();
      onTouchBottom(false);
    }
  };

  return (
    <View ref={ref} collapsable={false} {...viewProps} onLayout={handleOnLayout}>
      {children}
    </View>
  );
};
