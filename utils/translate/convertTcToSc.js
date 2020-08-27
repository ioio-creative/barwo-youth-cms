const OpenCC = require('opencc');
const converter = new OpenCC('hk2s.json');

module.exports = async tcText => {
  return await converter.convertPromise(tcText);
};
