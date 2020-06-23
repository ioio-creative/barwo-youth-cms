const isNonEmptyArray = obj => {
  return Array.isArray(obj) && obj.length > 0;
};

export default isNonEmptyArray;

export const getArraySafe = obj => {
  return isNonEmptyArray(obj) ? obj : [];
};
