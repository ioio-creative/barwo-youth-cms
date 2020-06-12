const { validationResult } = require('express-validator');

// https://express-validator.github.io/docs/
module.exports.returnValidationResults = (req, res) => {
  const validationResultObj = validationResult(req);
  if (!validationResultObj.isEmpty()) {
    console.error(validationResultObj.array());
    res.status(400).json({
      errors: validationResultObj.array().map(error => error.msg)
    });
    return false;
  }
  return true;
};
