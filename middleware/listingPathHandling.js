const config = require('config');
const { generalErrorHandle } = require('../utils/errorHandling');
const getFindLikeTextRegex = require('../utils/regex/getFindLikeTextRegex');

module.exports = function (req, res, next) {
  try {
    // pagination related queries
    const page = req.query.page;
    const sortOrder = req.query.sortOrder;
    const sortBy = req.query.sortBy;

    const paginationOptions = {
      limit: config.get('Pagination_ElementsPerPage'),
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

    // filter related queries
    const filterText = req.query.filterText;

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
