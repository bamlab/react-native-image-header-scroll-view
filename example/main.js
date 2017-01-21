import Exponent from 'exponent';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar
  } from 'react-native';

import HeaderImageScrollView from 'react-native-image-header-scroll-view';
import tvShowContent from './assets/tvShowContent';


const TvShow = () => (
  <View style={{ flex:1 }}>
    <StatusBar barStyle="light-content" />
    <HeaderImageScrollView
      maxHeight={250}
      minHeight={66}
      maxOverlayOpacity={0.6}
      minOverlayOpacity={0.3}
      fadeOutForeground
      renderHeader={() => (
        <Image source={tvShowContent.image} style={styles.image} />
      )}
      renderForeground={() => (
        <View style={styles.titleContainer}>
          <Text style={styles.imageTitle}>{tvShowContent.title}</Text>
        </View>
      )}
    >
      <View style={styles.section}>
        <Text style={styles.title}>
          <Text style={styles.name}>{tvShowContent.title}</Text>, ({tvShowContent.year})
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.sectionContent}>{tvShowContent.overview}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Keywords</Text>
        <View style={styles.keywords}>
          {tvShowContent.keywords.map((keyword) => (
            <View style={styles.keywordContainer} key={keyword}>
              <Text style={styles.keyword}>{keyword}</Text>
            </View>
          ))}
        </View>
      </View>
    </HeaderImageScrollView>
  </View>
);

const styles = StyleSheet.create({
  image: {
    height: 250,
    width: Dimensions.get('window').width,
    alignSelf: 'stretch',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
  },
  name: {
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    fontSize: 16,
    textAlign: 'justify',
  },
  keywords: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  keywordContainer: {
    backgroundColor: '#999999',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  keyword: {
    fontSize: 16,
    color: 'white',
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTitle: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 24,
  }
});

Exponent.registerRootComponent(TvShow);
