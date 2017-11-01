// @flow weak
import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import _ from 'lodash';

type Props = {
  onBeginHidden: Function,
  onHide: Function,
  onBeginDisplayed: Function,
  onDisplay: Function,
  onTouchTop: Function,
  onTouchBottom: Function,
  children?: React$Node,
};

type DefaultProps = {
  onBeginHidden: Function,
  onHide: Function,
  onBeginDisplayed: Function,
  onDisplay: Function,
  onTouchTop: Function,
  onTouchBottom: Function,
};

type State = {
  touched: boolean,
  hidden: boolean,
};

type Context = {
  scrollPageY?: number,
  scrollY: Animated.Value,
};

class TriggeringView extends Component<Props, State> {
  initialPageY: number;
  listenerId: string;
  ref: ?any; // @see https://github.com/facebook/react-native/issues/15955
  height: number;
  context: Context;

  onScroll: Function;
  onRef: Function;
  onLayout: Function;
  state: State = {
    touched: false,
    hidden: false,
  };

  static defaultProps: DefaultProps = {
    onBeginHidden: () => {},
    onHide: () => {},
    onBeginDisplayed: () => {},
    onDisplay: () => {},
    onTouchTop: () => {},
    onTouchBottom: () => {},
  };

  constructor(props) {
    super(props);
    this.initialPageY = 0;
  }

  componentWillMount() {
    if (!this.context.scrollY) {
      return;
    }
    this.listenerId = this.context.scrollY.addListener(this.onScroll);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!this.context.scrollY) {
      return;
    }
    this.context.scrollY.removeListener(this.listenerId);
    nextContext.scrollY.addListener(this.onScroll);
  }

  onRef = ref => {
    this.ref = ref;
  };

  onLayout = e => {
    if (!this.ref) {
      return;
    }
    const layout = e.nativeEvent.layout;
    this.height = layout.height;
    this.ref.measure((x, y, width, height, pageX, pageY) => {
      this.initialPageY = pageY;
    });
  };

  onScroll = event => {
    if (!this.context.scrollPageY) {
      return;
    }
    const pageY = this.initialPageY - event.value;
    this.triggerEvents(this.context.scrollPageY, pageY, pageY + this.height);
  };

  triggerEvents(value, top, bottom) {
    if (!this.state.touched && value >= top) {
      this.setState(() => ({ touched: true }));
      this.props.onBeginHidden();
      this.props.onTouchTop(true);
    } else if (this.state.touched && value < top) {
      this.setState(() => ({ touched: false }));
      this.props.onDisplay();
      this.props.onTouchTop(false);
    }

    if (!this.state.hidden && value >= bottom) {
      this.setState(() => ({ hidden: true }));
      this.props.onHide();
      this.props.onTouchBottom(true);
    } else if (this.state.hidden && value < bottom) {
      this.setState(() => ({ hidden: false }));
      this.props.onBeginDisplayed();
      this.props.onTouchBottom(false);
    }
  }

  render() {
    const viewProps = _.omit(this.props, _.keys(TriggeringView.propTypes));
    return (
      <View ref={this.onRef} onLayout={this.onLayout} collapsable={false} {...viewProps}>
        {this.props.children}
      </View>
    );
  }
}

export default TriggeringView;
