import React from 'react';
import { Image, Dimensions } from 'react-native';
import { FixedContent, Props as ComponentProps } from './FixedContent.component';

interface SourceObjectProps {
  uri?: string;
  bundle?: string;
  method?: string;
  headers?: { [key: string]: string };
  body?: string;
  cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached';
  width?: number;
  height?: number;
  scale?: number;
}
type SourceProps = number | SourceObjectProps | SourceObjectProps[];

interface Options {
  headerImage: SourceProps;
  disableHeaderGrow?: boolean;
  fixedForegroundContainerStyles?: object;
  headerContainerStyle?: object;
  maxHeight?: number;
  minHeight?: number;
  maxOverlayOpacity?: number;
  minOverlayOpacity?: number;
  overlayColor?: string;
  renderFixedForeground?: () => React.ReactElement;
  renderHeader?: () => React.ReactElement;
}

export const fixedImage = (options: Options) => (props: ComponentProps) => (
  <FixedContent
    {...props}
    {...options}
    renderHeader={() => (
      <Image
        source={options.headerImage}
        style={{
          height: options.maxHeight || props.maxHeight,
          width: Dimensions.get('window').width,
        }}
      />
    )}
  />
);
