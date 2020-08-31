const { isNonEmptyArray } = require('./isNonEmptyArray');

const shuffleInPlace = array => {
  if (!isNonEmptyArray(array)) {
    return [];
  }

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

const shuffleNew = array => {
  return shuffleInPlace([...array]);
};

module.exports.shuffleInPlace = shuffleInPlace;
module.exports.shuffleNew = shuffleNew;
