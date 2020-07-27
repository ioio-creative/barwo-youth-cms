const { getLanguageByRouteParam } = require('../globals/languages');
const { LANGUAGE_INVALID } = require('../types/responses/general');

module.exports = function (req, res, next) {
  const langParam = req.params.lang;
  const lang = getLanguageByRouteParam(langParam);

  req.language = lang;
  next();
};
