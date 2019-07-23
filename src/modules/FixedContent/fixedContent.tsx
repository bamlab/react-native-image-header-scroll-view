import React from 'react';
import { FixedContent, Props } from './FixedContent.component';

export const fixedContent = (options: Partial<Props>) => (props: Props) => (
  <FixedContent {...props} {...options} />
);
