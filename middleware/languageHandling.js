const { getLanguageByRouteParam } = require('../globals/languages');
const { LANGUAGE_INVALID } = require('../types/responses/general');

module.exports = function (req, res, next) {
  const langParam = req.params.lang;

  const lang = getLanguageByRouteParam(langParam);
  if (!lang) {
    // 400 bad request
    return res.status(400).json({
      errors: [LANGUAGE_INVALID]
    });
  }

  req.language = lang;
  next();
};
