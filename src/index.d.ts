declare module "react-native-image-header-scroll-view" {
    import * as React from "react";
    import { ScrollViewProps, ViewStyle, TextStyle, ImageStyle, Animated } from "react-native";

    interface Dictionary {
        [key: string]: string;
    }

    interface SourceObjectProps {
        uri?: string,
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

    interface HeaderImageScrollViewProps extends ScrollViewProps {
        children?: React.ReactElement;
        childrenStyle?: ViewStyle | TextStyle | ImageStyle;
        overlayColor?: string; // defaults to black
        fadeOutForeground?: boolean;
        foregroundParallaxRatio?: number; // defaults to 1
        maxHeight?: number; // default is 80
        minHeight?: number; // default is 125
        maxOverlayOpacity?: number; // defaults to 0.3
        minOverlayOpacity?: number; // defaults to 0
        renderFixedForeground?: () => React.ReactElement;
        renderForeground?: () => React.ReactElement;
        renderHeader?: () => React.ReactElement; // default is an empty view.
        renderTouchableFixedForeground?: () => React.ReactElement;
        ScrollViewComponent?: React.ComponentType<ScrollViewProps>;
        scrollViewBackgroundColor?: string; // defaults to white.
        headerImage?: SourceProps;
        useNativeDriver?: boolean; // defaults to false.
        headerContainerStyle?: object;
        fixedForegroundContainerStyles?: object;
        disableHeaderGrow?: boolean;
    }

    interface HeaderImageScrollViewState {
        scrollY: Animated.Value;
        pageY: number;
    }

    class HeaderImageScrollView extends React.Component<HeaderImageScrollViewProps, HeaderImageScrollViewState> {}

    interface TriggeringViewProps {
    onBeginHidden?: Function;
    onHide?: Function;
    onBeginDisplayed?: Function;
    onDisplay?: Function;
    onTouchTop?: Function;
    onTouchBottom?: Function;
    children?: React.ReactNode;
    onLayout?: Function;
    bottomOffset?: number;
    topOffset?: number;
    }

    interface TriggeringViewState {
        touched: boolean;
        hidden: boolean;
    }

    class TriggeringView extends React.Component<TriggeringViewProps, TriggeringViewState> {}

    export default HeaderImageScrollView;
    export { TriggeringView }
}
