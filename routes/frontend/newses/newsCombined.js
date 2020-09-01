const express = require('express');
const router = express.Router();

const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getNewsList } = require('./newses');
const { getNewsletterList } = require('../newsletters/newsletters');
const { getNewsMediaItemList } = require('../newsMediaItems/newsMediaItems');

// @route   GET api/frontend/newses/newsCombined/:lang
// @desc    Get all newses, newsletters, newsMediaItems
// @access  Public
router.get('/:lang', [languageHandling], async (req, res) => {
  try {
    const newsCombined = {
      newsesByType: await getNewsList(req),
      newsletters: await getNewsletterList(req),
      newsMediaItemsByYear: await getNewsMediaItemList(req)
    };
    res.json(newsCombined);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
