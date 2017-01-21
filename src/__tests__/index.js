import React from 'react';
import 'react-native';
import ImageHeaderScrollView from '../index.js';
import renderer from 'react-test-renderer';

it('renders correctly by default', () => {
  const tree = renderer.create(
    <ImageHeaderScrollView />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
