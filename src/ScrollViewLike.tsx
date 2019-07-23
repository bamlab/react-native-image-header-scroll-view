// @flow
import { Component } from 'react';
import { ScrollView } from 'react-native';

class ScrollViewLike<Props, State> extends Component<Props, State> {
  scrollViewRef?: any;

  setScrollViewRef = (ref: any) => {
    this.scrollViewRef = ref;
  };

  /*
   * Expose `ScrollView` API so this component is composable
   * with any component that expects a `ScrollView`.
   */
  getScrollableNode(): any {
    const responder = this.getScrollResponder();
    if (!responder) {
      return;
    }
    return responder.getScrollableNode();
  }

  getInnerViewNode(): any {
    const responder = this.getScrollResponder();
    if (!responder) {
      return;
    }
    return responder.getInnerViewNode();
  }

  scrollTo(
    y?: number | { x?: number; y?: number; animated?: boolean },
    x?: number,
    animated?: boolean
  ) {
    const responder = this.getScrollResponder();
    if (!responder) {
      return;
    }
    responder.scrollTo(y, x, animated);
  }

  scrollToEnd(params?: { animated?: boolean }) {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.scrollToEnd &&
      typeof this.scrollViewRef.scrollToEnd === 'function'
    ) {
      this.scrollViewRef.scrollToEnd(params);
    }
  }

  getScrollResponder(): ScrollView {
    if (this.scrollViewRef && this.scrollViewRef.getScrollResponder) {
      return this.scrollViewRef.getScrollResponder();
    }
  }

  setNativeProps(props: Object) {
    if (this.scrollViewRef && this.scrollViewRef.setNativeProps) {
      this.scrollViewRef.setNativeProps(props);
    }
  }

  recordInteraction() {
    if (this.scrollViewRef && this.scrollViewRef.recordInteraction) {
      this.scrollViewRef.recordInteraction();
    }
  }

  flashScrollIndicators() {
    if (this.scrollViewRef && this.scrollViewRef.flashScrollIndicators) {
      this.scrollViewRef.flashScrollIndicators();
    }
  }

  getMetrics() {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.getMetrics &&
      typeof this.scrollViewRef.getMetrics === 'function'
    ) {
      return this.scrollViewRef.getMetrics();
    }
  }

  /**
   * Expose `FlatList` API so this component is composable
   * with any component that expects a `FlatList`.
   */
  scrollToIndex(params: {
    animated?: boolean;
    index: number;
    viewOffset?: number;
    viewPosition?: number;
  }) {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.scrollToIndex &&
      typeof this.scrollViewRef.scrollToIndex === 'function'
    ) {
      this.scrollViewRef.scrollToIndex(params);
    }
  }

  scrollToItem(params: { animated?: boolean; item: any; viewPosition?: number }) {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.scrollToItem &&
      typeof this.scrollViewRef.scrollToItem === 'function'
    ) {
      this.scrollViewRef.scrollToItem(params);
    }
  }

  scrollToOffset(params: { animated?: boolean; offset: number }) {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.scrollToOffset &&
      typeof this.scrollViewRef.scrollToOffset === 'function'
    ) {
      this.scrollViewRef.scrollToOffset(params);
    }
  }

  /**
   * Expose `SectionList` API so this component is composable
   * with any component that expects a `SectionList`.
   */
  scrollToLocation(params: {
    animated?: boolean;
    itemIndex: number;
    sectionIndex: number;
    viewOffset?: number;
    viewPosition?: number;
  }) {
    if (
      this.scrollViewRef &&
      this.scrollViewRef.scrollToLocation &&
      typeof this.scrollViewRef.scrollToLocation === 'function'
    ) {
      this.scrollViewRef.scrollToLocation(params);
    }
  }
}
export default ScrollViewLike;
