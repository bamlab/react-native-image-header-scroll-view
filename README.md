# react-native-image-header-scroll-view

A ScrollView-like component that:
 - Has a fixed image header
 - Keep the image as a nav bar
 - Works on iOS and Android

## Installation

```
$ npm install react-native-image-header-scroll-view --save
```

## Demo

![react-native-image-header-scroll-view demo](./demo.gif)

## Basic Usage 

```jsx
import HeaderImageScrollView from 'react-native-image-header-scroll-view';

// Inside of a component's render() method:
render() {
  return (
    <HeaderImageScrollView
      maxHeight={200}
      minHeight={50}
      renderHeader={() => (
        <Image source={require('image.jpg')} style={styles.image} />
      )}
    >
      <View style={{ height: 1000 }}>
          <Text>Scroll Me!</Text>
      </View>
    </HeaderImageScrollView>
  );
}
```

## Usage (API)

All of the properties of `ScrollView` are supported. Please refer to the
[`ScrollView` documentation](https://facebook.github.io/react-native/docs/scrollview.html) for more detail.

The `HeaderImageScrollView` handle also the following props. None is required :

### Header
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `renderHeader` | `function` | Empty view | Function which return the component to use as header. It can return background image for example. |
| `maxHeight` | `number` | `80` | Max height for the header |
| `minHeight` | `number` | `125` | Min height for the header (in navbar mode) |
| `minOverlayOpacity` | `number` | `0` | Opacity of a black overlay on the header before any scroll |
| `maxOverlayOpacity` | `number` | `0.3` | Opacity of a black overlay on the header when in navbar mode |


### Foreground

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `renderForeground` | `function` | Empty view | Function which return the component to use at foreground. The component is render in front of the header and scroll with the ScrollView. It can return a title for example.|
| `foregroundParallaxRatio` | `number` | `1` | Ration for parallax effect of foreground when scrolling. If 2, the header goes up two times faster than the scroll |
| `fadeOutForeground` | `bool` | `false` | If set, add a fade out effect on the foreground when scroll up |

## Other open-source modules by the folks at [BAM](http://github.com/bamlab)

 * [generator-rn-toolbox](https://github.com/bamlab/generator-rn-toolbox)
 * [react-native-image-resizer](https://github.com/bamlab/react-native-image-resizer)
 * [react-native-numberpicker-dialog](https://github.com/bamlab/react-native-numberpicker-dialog)
 * [react-native-animated-picker](https://github.com/bamlab/react-native-animated-picker)
