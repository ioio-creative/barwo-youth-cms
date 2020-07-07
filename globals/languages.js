const languages = {
  TC: { _id: 'TC', routeParam: 'tc', entityPropSuffix: '_tc' },
  SC: { _id: 'SC', routeParam: 'sc', entityPropSuffix: '_sc' },
  EN: { _id: 'EN', routeParam: 'en', entityPropSuffix: '_en' }
};

const languageArray = Object.values(languages);

const getLanguagePropArray = propName => {
  return languageArray.map(language => language[propName]);
};

const getLanguageByRouteParam = langParam => {
  return languageArray.find(
    language => language.routeParam === langParam.toLowerCase()
  );
};

const getEntityPropByLanguage = (entity, propName, language) => {
  return entity[propName + language.entityPropSuffix];
};

module.exports.getLanguageByRouteParam = getLanguageByRouteParam;

module.exports.getEntityPropByLanguage = getEntityPropByLanguage;
