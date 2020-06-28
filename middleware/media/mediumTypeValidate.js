const {
  routesOfMediumTypes,
  mediumResponseTypes,
  getMediumTypeFromRoute
} = require('../../models/Medium');

module.exports = function (req, res, next) {
  if (!routesOfMediumTypes.includes(req.params.mediumType)) {
    return res
      .status(404)
      .json({ errors: [mediumResponseTypes.MEDIUM_TYPE_NOT_EXISTS] });
  }

  // inject mediumType object to request
  req.mediumType = getMediumTypeFromRoute(req.params.mediumType);

  next();
};
