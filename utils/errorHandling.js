const { SERVER_ERROR } = require('../types/responses/general');

module.exports.generalErrorHandle = (err, res) => {
  console.error(JSON.stringify(err, null, 2));
  res.status(500).json({ errors: [SERVER_ERROR] });
};
