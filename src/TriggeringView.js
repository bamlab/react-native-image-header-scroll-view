import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import _ from 'lodash';

class TriggeringView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      hidden: false,
    };
    this.onScroll = this.onScroll.bind(this);
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

  onScroll() {
    this.containerView.measure((x, y, width, height, pageX, pageY) => {
      this.triggerEvents(this.context.scrollPageY, pageY, pageY + height);
    });
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
    const viewProps = _.pick(this.props, _.keys(View.propTypes));
    return (
      <View
        ref={(view) => { this.containerView = view; }}
        collapsable={false}
        {...viewProps}
      >
        { this.props.children }
      </View>
    );
  }
}
TriggeringView.propTypes = {
  onBeginHidden: React.PropTypes.func,
  onHide: React.PropTypes.func,
  onBeginDisplayed: React.PropTypes.func,
  onDisplay: React.PropTypes.func,
  onTouchTop: React.PropTypes.func,
  onTouchBottom: React.PropTypes.func,
  ...View.propTypes,
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
  scrollY: React.PropTypes.instanceOf(Animated.Value),
  scrollPageY: React.PropTypes.number,
};

export default TriggeringView;
