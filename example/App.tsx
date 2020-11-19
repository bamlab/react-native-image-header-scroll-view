import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';

export default function App() {
  return (
    <ImageHeaderScrollView
      maxHeight={200}
      minHeight={100}
      headerImage={require('./assets/NZ.jpg')}
      renderForeground={() => (
        <View style={styles.foregroundContainer}>
          <TouchableOpacity onPress={() => console.log('tap!!')}>
            <Text style={styles.header}>Tap Me!</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <View style={styles.content}>
        <TriggeringView onHide={() => console.log('text hidden')}>
          <Text>Scroll Me!</Text>
        </TriggeringView>
      </View>
    </ImageHeaderScrollView>
  );
}

const styles = StyleSheet.create({
  foregroundContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { backgroundColor: 'transparent' },
  content: { height: 1000 },
});
