const path = require('path');

/* path */

const extnameWithDot = fileName => {
  return path.extname(fileName);
};

module.exports.extnameWithDot = extnameWithDot;

const extnameWithoutDot = fileName => {
  const extWithDot = extnameWithDot(fileName);
  return extWithDot && extWithDot[0] === '.' && extWithDot.length >= 2
    ? extWithDot.substr(1)
    : extWithDot;
};

module.exports.extnameWithoutDot = extnameWithoutDot;

/* end of path */
