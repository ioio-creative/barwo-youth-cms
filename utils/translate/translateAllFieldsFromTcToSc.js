const { languages } = require('../../globals/languages');
const convertTcToSc = require('./convertTcToSc');

const scFieldSuffix = languages.SC.entityPropSuffix;
const tcFieldSuffix = languages.TC.entityPropSuffix;

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
