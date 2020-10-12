const languages = {
  TC: { _id: 'TC', routeParam: 'tc', entityPropSuffix: '_tc' },
  SC: { _id: 'SC', routeParam: 'sc', entityPropSuffix: '_sc' },
  EN: { _id: 'EN', routeParam: 'en', entityPropSuffix: '_en' }
};

const defaultLanguage = languages.TC;

const languageArray = Object.values(languages);

const getLanguagePropArray = propName => {
  return languageArray.map(language => language[propName]);
};

const getLanguageById = (langId = defaultLanguage._id) => {
  const langIdCleaned = langId.toLowerCase();
  const langToReturn = languageArray.find(
    language => language._id.toLowerCase() === langIdCleaned
  );
  return langToReturn || defaultLanguage;
};

const getLanguageByRouteParam = (langParam = defaultLanguage.routeParam) => {
  const langParamCleaned = langParam.toLowerCase();
  const langToReturn = languageArray.find(
    language => language.routeParam.toLowerCase() === langParamCleaned
  );
  return langToReturn || defaultLanguage;
};

const getEntityPropByLanguage = (
  entity,
  propName,
  language = defaultLanguage
) => {
  const requiredPropName = propName + language.entityPropSuffix;
  return entity && entity[requiredPropName] ? entity[requiredPropName] : '';
};

module.exports.languages = languages;

module.exports.defaultLanguage = defaultLanguage;

module.exports.getLanguageById = getLanguageById;

module.exports.getLanguageByRouteParam = getLanguageByRouteParam;

module.exports.getEntityPropByLanguage = getEntityPropByLanguage;
