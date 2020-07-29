const bcrypt = require('bcryptjs');

const checkPassword = async (passwordInput, hashedPassword) => {
  const isMatch = bcrypt.compare(passwordInput, hashedPassword);
  return isMatch;
};

module.exports = checkPassword;
