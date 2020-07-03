const bcrypt = require('bcryptjs');

const hashPasswordInput = async passwordInput => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(passwordInput, salt);
};

module.exports.hashPasswordInput = hashPasswordInput;
