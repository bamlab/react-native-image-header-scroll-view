import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// @ts-ignore
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

export default function App() {
  return (
    <HeaderImageScrollView
      maxHeight={200}
      minHeight={56}
      headerImage={require('./assets/NZ.jpg')}
      renderForeground={() => (
        <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => console.log('tap!!')}>
            <Text style={{ backgroundColor: 'transparent' }}>Tap Me!</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <View style={{ height: 1000 }}>
        <TriggeringView onHide={() => console.log('text hidden')}>
          <Text>Scroll Me!</Text>
        </TriggeringView>
      </View>
    </HeaderImageScrollView>
  );
}
