import React from 'react';
import { ScalingImage, Props } from './ScalingImage.component';

export const scalingImage = (options: Partial<Props>) => (props: Props) => (
  <ScalingImage {...props} {...options} />
);
