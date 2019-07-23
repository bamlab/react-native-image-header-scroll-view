import { ReactTestInstance } from 'react-test-renderer';

const getStylesAnimatedValue = (style: any, key?: string): { [key: string]: number } => {
  if (!style || (!Array.isArray(style) && typeof style !== 'object')) {
    return {};
  }

  if (style.__getValue && key) {
    return {
      [key]: style.__getValue(),
    };
  }

  if (Array.isArray(style)) {
    return style.reduce(
      (acc, val) => ({
        ...acc,
        ...getStylesAnimatedValue(val),
      }),
      {}
    );
  }

  return Object.keys(style).reduce(
    (acc, key) => ({
      ...acc,
      ...getStylesAnimatedValue(style[key], key),
    }),
    {}
  );
};

export const getAnimatedValues = (
  comp: ReactTestInstance | ReactTestInstance[]
): { [key: string]: number } => {
  if (Array.isArray(comp)) {
    return comp.reduce(
      (acc, val) => ({
        ...acc,
        ...getAnimatedValues(val),
      }),
      {}
    );
  }
  const style = comp.props.style;
  return getStylesAnimatedValue(style);
};
