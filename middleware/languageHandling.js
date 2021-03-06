const { getLanguageByRouteParam } = require('../globals/languages');

module.exports = function (req, res, next) {
  const langParam = req.params.lang;
  const lang = getLanguageByRouteParam(langParam);

  req.language = lang;
  next();
};
