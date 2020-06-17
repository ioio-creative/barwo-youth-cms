const config = require('config');
const { generalErrorHandle } = require('../utils/errorHandling');

module.exports = function (req, res, next) {
  try {
    // queries
    const page = req.query.page;
    const sortOrder = req.query.sortOrder;
    const sortBy = req.query.sortBy;

    const paginationOptions = {
      limit: config.get('tableElementPerPage'),
      sort: { lastModifyDT: -1 },
      populate: { path: 'lastModifyUser', select: 'name' }
    };
    if (page) {
      paginationOptions.page = page;
    }
    if (sortBy) {
      paginationOptions.sort = {
        [sortBy]: sortOrder ? sortOrder : 1
      };
    }

    // inject paginationOptions to req
    req.paginationOptions = paginationOptions;

    next();
  } catch (err) {
    generalErrorHandle(err, res);
  }
};
