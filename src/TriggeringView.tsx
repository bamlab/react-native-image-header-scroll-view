// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import throttle from 'lodash/throttle';

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

interface Context {
  scrollPageY?: number;
  scrollY: Animated.Value<number>;
}

class TriggeringView extends Component<Props, State> {
  initialPageY: number;
  ref: any;
  height: number;
  context: Context;

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

  static contextTypes = {
    scrollY: PropTypes.instanceOf(Animated.Value),
    scrollPageY: PropTypes.number,
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

  onScroll = ([value]) => {
    if (!this.context.scrollPageY) {
      return;
    }
    const pageY = this.initialPageY - value;
    this.triggerEvents(this.context.scrollPageY, pageY, pageY + this.height);
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
      <React.Fragment>
        <Animated.Code>
          {() => Animated.call([this.context.scrollY], throttle(this.onScroll, 100))}
        </Animated.Code>
        <View ref={this.onRef} collapsable={false} {...viewProps} onLayout={this.onLayout}>
          {this.props.children}
        </View>
      </React.Fragment>
    );
  }
}

export default TriggeringView;
