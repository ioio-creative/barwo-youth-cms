const isNonEmptyArray = obj => {
  return Array.isArray(obj) && obj.length > 0;
};

module.exports.isNonEmptyArray = isNonEmptyArray;

module.exports.getArraySafe = obj => {
  return isNonEmptyArray(obj) ? obj : [];
};
