const { SERVER_ERROR } = require('../types/responses/general');

const { validationResult } = require('express-validator');

module.exports.returnValidationResults = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array()
    });
    return false;
  }
  return true;
};
