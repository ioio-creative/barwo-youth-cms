import isNonEmptyArray from './isNonEmptyArray';

const firstOrDefault = (array, defaultValue = null) => {
  return isNonEmptyArray(array) ? array[0] : defaultValue;
};

export default firstOrDefault;
