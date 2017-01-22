import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import ImageHeaderScrollView, { TriggeringView } from '../index.js';

describe('TriggeringView', () => {
  it('renders correctly by default', () => {
    const tree = renderer.create(
      <ImageHeaderScrollView>
        <TriggeringView />
      </ImageHeaderScrollView>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should dont\'t crash without ImageHeaderScrollView', () => {
    const tree = renderer.create(
      <TriggeringView />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should display children', () => {
    const tree = renderer.create(
      <TriggeringView>
        <Text> Hello world </Text>
      </TriggeringView>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
