const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const distinct = array => {
  return array.filter(unique);
};

module.exports = distinct;
