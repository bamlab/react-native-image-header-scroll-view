// @flow weak
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated } from 'react-native';
import _ from 'lodash';

class TriggeringView extends Component<*, *, *> {
  initialPageY: number;
  listenerId: number;
  ref: *;
  height: number;

  onScroll: Function;
  onRef: Function;
  onLayout: Function;

  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      hidden: false,
    };
    this.initialPageY = 0;
    this.onScroll = this._onScroll.bind(this);
    this.onRef = this._onRef.bind(this);
    this.onLayout = this._onLayout.bind(this);
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

  _onRef(ref) {
    this.ref = ref;
  }

  _onLayout(e) {
    const layout = e.nativeEvent.layout;
    this.height = layout.height;
    this.ref.measure((x, y, width, height, pageX, pageY) => {
      this.initialPageY = pageY;
    });
  }

  _onScroll(event) {
    const pageY = this.initialPageY - event.value;
    this.triggerEvents(this.context.scrollPageY, pageY, pageY + this.height);
  }

  triggerEvents(value, top, bottom) {
    if (!this.state.touched && value >= top) {
      this.setState({ touched: true });
      this.props.onBeginHidden();
      this.props.onTouchTop(true);
    } else if (this.state.touched && value < top) {
      this.setState({ touched: false });
      this.props.onDisplay();
      this.props.onTouchTop(false);
    }

    if (!this.state.hidden && value >= bottom) {
      this.setState({ hidden: true });
      this.props.onHide();
      this.props.onTouchBottom(true);
    } else if (this.state.hidden && value < bottom) {
      this.setState({ hidden: false });
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
TriggeringView.propTypes = {
  onBeginHidden: PropTypes.func,
  onHide: PropTypes.func,
  onBeginDisplayed: PropTypes.func,
  onDisplay: PropTypes.func,
  onTouchTop: PropTypes.func,
  onTouchBottom: PropTypes.func,
};

TriggeringView.defaultProps = {
  onBeginHidden: () => {},
  onHide: () => {},
  onBeginDisplayed: () => {},
  onDisplay: () => {},
  onTouchTop: () => {},
  onTouchBottom: () => {},
};

TriggeringView.contextTypes = {
  scrollY: PropTypes.instanceOf(Animated.Value),
  scrollPageY: PropTypes.number,
};

export default TriggeringView;
