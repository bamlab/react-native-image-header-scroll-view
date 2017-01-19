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

## Other open-source modules by the folks at [BAM](http://github.com/bamlab)

 * [generator-rn-toolbox](https://github.com/bamlab/generator-rn-toolbox)
 * [react-native-image-resizer](https://github.com/bamlab/react-native-image-resizer)
 * [react-native-numberpicker-dialog](https://github.com/bamlab/react-native-numberpicker-dialog)
 * [react-native-animated-picker](https://github.com/bamlab/react-native-animated-picker)
