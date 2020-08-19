const cleanLabelForReceivingFromFrontEnd = require('../utils/label/cleanLabelForReceivingFromFrontEnd');

module.exports = function (req, res, next) {
  const labelParam = req.params.label;
  const label = cleanLabelForReceivingFromFrontEnd(labelParam);

  req.detailItemLabel = label;
  next();
};
