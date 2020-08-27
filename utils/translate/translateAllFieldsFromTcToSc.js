const convertTcToSc = require('./convertTcToSc');

const scFieldSuffix = '_sc';
const tcFieldSuffix = '_tc';

module.exports = async obj => {
  const newObj = {
    ...obj
  };
  await Promise.all(
    Object.keys(newObj)
      .filter(key => key.includes(scFieldSuffix))
      .map(async key => {
        newObj[key] = await convertTcToSc(
          newObj[key.replace(scFieldSuffix, tcFieldSuffix)]
        );
      })
  );
  return newObj;
};
