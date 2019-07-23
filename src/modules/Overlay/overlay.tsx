import React from 'react';
import { Overlay, Props } from './Overlay.component';

export const overlay = (options: Partial<Props>) => (props: Props) => (
  <Overlay {...props} {...options} />
);
