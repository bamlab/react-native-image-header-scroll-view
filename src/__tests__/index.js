import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ImageHeaderScrollView from '../index.js';

describe('ImageHeaderScrollView', () => {
  it('renders correctly by default', () => {
    const tree = renderer.create(
      <ImageHeaderScrollView />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
