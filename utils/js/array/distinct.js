const { getArraySafe } = require('./isNonEmptyArray');

// const unique = (value, index, self) => {
//   return self.indexOf(value) === index;
// };

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
const removeDuplicatesFromArray = array => {
  return [...new Set(array)];
};

const distinct = array => {
  const safeArray = getArraySafe(array);

  //return safeArray.filter(unique);

  return removeDuplicatesFromArray(safeArray);
};

module.exports = distinct;
