import React from 'react';
import { MovingContent, Props } from './MovingContent.component';

export const movingContent = (options: Partial<Props>) => (props: Props) => (
  <MovingContent {...props} {...options} />
);
