const { validationResult } = require('express-validator');
const { generalErrorHandle } = require('../utils/errorHandling');

// https://express-validator.github.io/docs/
module.exports = function (req, res, next) {
  try {
    const validationResultObj = validationResult(req);
    if (!validationResultObj.isEmpty()) {
      console.error(validationResultObj.array());
      return res.status(400).json({
        errors: validationResultObj.array().map(error => error.msg)
      });
    }

    next();
  } catch (err) {
    generalErrorHandle(err, res);
  }
};
