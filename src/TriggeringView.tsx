// @flow
import React, { Component } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import throttle from 'lodash/throttle';
import { ScrollConsumer } from './ScrollContext';

interface Props {
  onBeginHidden?: Function;
  onHide?: Function;
  onBeginDisplayed?: Function;
  onDisplay?: Function;
  onTouchTop?: Function;
  onTouchBottom?: Function;
  children?: React.ReactNode;
  onLayout?: (event: LayoutChangeEvent) => void;
  bottomOffset?: number;
  topOffset?: number;
}

interface State {
  touched: boolean;
  hidden: boolean;
}

class TriggeringView extends Component<Props, State> {
  initialPageY: number;
  ref: any;
  height: number;

  state: State = {
    touched: false,
    hidden: false,
  };

  static defaultProps = {
    onBeginHidden: () => {},
    onHide: () => {},
    onBeginDisplayed: () => {},
    onDisplay: () => {},
    onTouchTop: () => {},
    onTouchBottom: () => {},
    bottomOffset: 0,
    topOffset: 0,
  };

  constructor(props: Props) {
    super(props);
    this.initialPageY = 0;
  }

  onRef = (ref: any) => {
    this.ref = ref;
  };

  onLayout = (e: LayoutChangeEvent) => {
    if (this.props.onLayout) {
      this.props.onLayout(e);
    }
    if (!this.ref) {
      return;
    }
    const layout = e.nativeEvent.layout;
    this.height = layout.height;
    this.ref.measure((x, y, width, height, pageX, pageY) => {
      this.initialPageY = pageY;
    });
  };

  onScroll = (scrollPageY: number) => ([value]) => {
    if (!scrollPageY) {
      return;
    }
    const pageY = this.initialPageY - value;
    this.triggerEvents(scrollPageY, pageY, pageY + this.height);
  };

  triggerEvents(value: number, top: number, bottom: number) {
    const { bottomOffset, topOffset } = this.props;
    if (!this.state.touched && value >= top + topOffset) {
      this.setState({ touched: true });
      this.props.onBeginHidden();
      this.props.onTouchTop(true);
    } else if (this.state.touched && value < top + topOffset) {
      this.setState({ touched: false });
      this.props.onDisplay();
      this.props.onTouchTop(false);
    }

    if (!this.state.hidden && value >= bottom + bottomOffset) {
      this.setState({ hidden: true });
      this.props.onHide();
      this.props.onTouchBottom(true);
    } else if (this.state.hidden && value < bottom + bottomOffset) {
      this.setState({ hidden: false });
      this.props.onBeginDisplayed();
      this.props.onTouchBottom(false);
    }
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      onBeginHidden,
      onHide,
      onBeginDisplayed,
      onDisplay,
      onTouchTop,
      onTouchBottom,
      ...viewProps
    } = this.props;
    /* eslint-enable no-unused-vars */

    return (
      <ScrollConsumer>
        {({ scrollValue, scrollPageY }) => (
          <React.Fragment>
            <Animated.Code>
              {() => Animated.call([scrollPageY], throttle(this.onScroll(scrollPageY), 100))}
            </Animated.Code>
            <View ref={this.onRef} collapsable={false} {...viewProps} onLayout={this.onLayout}>
              {this.props.children}
            </View>
          </React.Fragment>
        )}
      </ScrollConsumer>
    );
  }
}

export default TriggeringView;
