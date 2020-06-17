// https://stackoverflow.com/questions/9824010/mongoose-js-find-user-by-username-like-value
// 2nd answer
module.exports = text => {
  return new RegExp(text, 'i');
};
