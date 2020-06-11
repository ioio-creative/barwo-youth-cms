const { SERVER_ERROR } = require('../types/responses/general');

module.exports.generalErrorHandle = (err, res) => {
  console.error(err);
  res.status(500).send({ type: SERVER_ERROR });
};