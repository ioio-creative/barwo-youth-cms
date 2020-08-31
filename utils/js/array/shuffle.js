const { isNonEmptyArray } = require('./isNonEmptyArray');

// https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
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
