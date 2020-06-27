const { SERVER_ERROR } = require('../types/responses/general');
const prettyStringify = require('./JSON/prettyStringify');
const { isNonEmptyArray } = require('./js/array/isNonEmptyArray');

const prettyPrintError = err => {
  let thingToPrint = err;
  if (isNonEmptyArray(Object.keys(err))) {
    thingToPrint = prettyStringify(err);
  }
  console.error(thingToPrint);
};

module.exports.generalErrorHandle = (err, res) => {
  console.error('generalErrorHandle:');
  prettyPrintError(err);
  res.status(500).json({ errors: [SERVER_ERROR] });
};

module.exports.duplicateKeyErrorHandle = (
  err,
  fieldName,
  errorTypeToUse,
  res
) => {
  console.error('duplicateKeyErrorHandle:');
  prettyPrintError(err);
  const { code, keyPattern } = err;
  const isDuplicateKeyError =
    code === 11000 && keyPattern && Object.keys(keyPattern).includes(fieldName);

  if (isDuplicateKeyError) {
    // bad request
    res.status(400).json({
      errors: [errorTypeToUse]
    });
  }

  const isErrorHandled = isDuplicateKeyError;
  return isErrorHandled;
};
