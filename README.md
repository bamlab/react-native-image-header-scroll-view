# react-native-image-header-scroll-view

![badge](https://circleci.com/gh/bamlab/react-native-image-header-scroll-view.svg?style=shield&circle-token=:circle-token)

A ScrollView-like component that:
 - Has a fixed image header
 - Keep the image as a nav bar
 - Works on iOS and Android

## Installation

```
$ npm install react-native-image-header-scroll-view --save
```

## Demo

![react-native-image-header-scroll-view demo android](./readmeAssets/demoAndroid.gif)|![react-native-image-header-scroll-view demo ios](./readmeAssets/demoIos.gif)

## Basic Usage 

```jsx
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

// Inside of a component's render() method:
render() {
  return (
    <HeaderImageScrollView
      maxHeight={200}
      minHeight={MIN_HEIGHT}
      headerImage={require('../../assets/NZ.jpg')}
    >
      <View style={{ height: 1000 }}>
        <TriggeringView onHide={() => console.log('text hidden')} >
          <Text>Scroll Me!</Text>
        </TriggeringView>
      </View>
    </HeaderImageScrollView>
  );
}
```

You can find examples in a [dedicated repository](https://github.com/bamlab/react-native-image-header-scroll-view-example).

## Usage (API)

All of the properties of `ScrollView` are supported. Please refer to the
[`ScrollView` documentation](https://facebook.github.io/react-native/docs/scrollview.html) for more detail.

The `HeaderImageScrollView` handle also the following props. None is required :

### Header

| Property | Type | Default | Description | Example |
| -------- | ---- | ------- | ----------- | ------- |
| `renderHeader` | `function` | Empty view | Function which return the component to use as header. It can return background image for example. | [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/3b9d2d0d7f71c6bf877e2d10cc65c9ab7e1b484d/src/Pages/PullToRefresh.js#L37) |
| `headerImage` | Image source Props (object or number) | `undefined` | Shortcut for `renderHeader={() => <Image source={this.props.headerImage} style={{ height: this.props.maxHeight, width: Dimensions.get('window').width }} />}` | [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/master/src/Pages/BasicUsage.js#L26) |
| `maxHeight` | `number` | `80` | Max height for the header | [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/master/src/Pages/BasicUsage.js#L24) |
| `minHeight` | `number` | `125` | Min height for the header (in navbar mode) | [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/master/src/Pages/BasicUsage.js#L24) |
| `minOverlayOpacity` | `number` | `0` | Opacity of a black overlay on the header before any scroll | [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/3b9d2d0d7f71c6bf877e2d10cc65c9ab7e1b484d/src/Pages/TvShow.js#L96) |
| `maxOverlayOpacity` | `number` | `0.3` | Opacity of a black overlay on the header when in navbar mode | [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/3b9d2d0d7f71c6bf877e2d10cc65c9ab7e1b484d/src/Pages/TvShow.js#L96) |
| `overlayColor` | `string` | `black` | Color of the overlay on the header | [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/master/src/Pages/Colors.js#L16) |



### Foreground

| Property | Type | Default | Description | Example |
| -------- | ---- | ------- | ----------- | ------- |
| `renderForeground` | `function` | Empty view | Function which return the component to use at foreground. The component is render in front of the header and scroll with the ScrollView. It can return a title for example.| [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/master/src/Pages/TvShow.js#L112) |
| `renderFixedForeground` | `function` | Empty view | Function which return the component to use as fixed foreground. The component is displayed with the header but not affected by the overlay.| [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/3b9d2d0d7f71c6bf877e2d10cc65c9ab7e1b484d/src/Pages/TvShow.js#L100) |
| `foregroundParallaxRatio` | `number` | `1` | Ration for parallax effect of foreground when scrolling. If 2, the header goes up two times faster than the scroll | [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/master/src/Pages/Colors.js#L23) |
| `fadeOutForeground` | `bool` | `false` | If set, add a fade out effect on the foreground when scroll up | [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/master/src/Pages/Colors.js#L13) |
| `renderTouchableFixedForeground` | `function` | Empty view | Same as `renderFixedForeground` but allow to use touchable in it. [*Can cause performances issues on Android*](https://github.com/bamlab/react-native-image-header-scroll-view/issues/6)| [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/master/src/Pages/PullToRefresh.js#L45) |

### Mixed

| Property | Type | Default | Description | Example |
| -------- | ---- | ------- | ----------- | ------- |
| `ScrollViewComponent` | `Component` | `ScrollView` | The component to be used for scrolling. Can be any component with an `onScroll` props (ie. `ListView`, `FlatList`, `SectionList` or `ScrollView`) | [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/master/src/Pages/Avignon.js#L34) |
| `scrollViewBackgroundColor` | `string` | `white` | Background color of the scrollView content | [example](https://github.com/bamlab/react-native-image-header-scroll-view-example/blob/master/src/Pages/PullToRefresh.js#L52) |


### TriggeringView

The module also export a TriggeringView component. It is a simple view witch accept callback called when it disappear
or appear at the top of the ImageHeaderScrollView. You can see [an exemple in the dedicated repository](https://www.youtube.com/watch?v=PsgxTiif0w8&index=17&list=UUwi4cpbdkeuyYD8lDo3Z6qA).

All of the properties of `View` are supported.


| Property | Type | Description |
| -------- | ---- | ----------- |
| `onBeginHidden` | `function` | Called when the component start to be hidden at the top of the scroll view. |
| `onHide` | `function` | Called when the component is not displayed any more after scroll up |
| `onBeginDisplayed` | `function` | Called when the component begin to be displayed again after scroll down |
| `onDisplay` | `function` | Called when the component finished to be displayed again. |
| `onTouchTop` | `function` | Called when the Top of the component touch the Top of the ScrollView. (`onDisplay` + `onBeginHidden`) |
| `onTouchBottom` | `function` | Called when the Bottom of the component touch the Top of the ScrollView. (`onHide` + `onBeginDisplayed`) |


## Other open-source modules by the folks at [BAM](http://github.com/bamlab)

 * [generator-rn-toolbox](https://github.com/bamlab/generator-rn-toolbox)
 * [react-native-image-resizer](https://github.com/bamlab/react-native-image-resizer)
 * [react-native-numberpicker-dialog](https://github.com/bamlab/react-native-numberpicker-dialog)
 * [react-native-animated-picker](https://github.com/bamlab/react-native-animated-picker)
