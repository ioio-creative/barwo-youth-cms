const config = require('config');
const { generalErrorHandle } = require('../utils/errorHandling');
const getFindLikeTextRegex = require('../utils/regex/getFindLikeTextRegex');

module.exports = function (req, res, next) {
  try {
    const query = req.query;

    // pagination related queries
    const page = query.page;
    const limit = query.limit;
    const sortOrder = query.sortOrder;
    const sortBy = query.sortBy;

    // const paginationOptions = {
    //   limit: config.get('Pagination.elementsPerPage'),
    //   sort: { lastModifyDT: -1 },
    //   populate: { path: 'lastModifyUser', select: 'name' }
    // };
    const paginationOptions = {};

    if (page) {
      paginationOptions.page = page;
    }
    if (sortBy) {
      paginationOptions.sort = {
        [sortBy]: sortOrder || 1
      };
    }
    if (limit) {
      paginationOptions.limit =
        limit || config.get('Pagination.elementsPerPage');
    }

    // inject paginationOptions to req
    req.paginationOptions = paginationOptions;

    // filter related queries
    const filterText = query.filterText;

    let filterTextRegex = null;
    if (!['', null, undefined].includes(filterText)) {
      filterTextRegex = getFindLikeTextRegex(filterText);
    }

    // inject filterTextRegex to req
    req.filterTextRegex = filterTextRegex;

    next();
  } catch (err) {
    generalErrorHandle(err, res);
  }
};
