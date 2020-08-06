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
    const language = req.language;
    const newsCombined = {
      newsesByType: await getNewsList(language),
      newsletters: await getNewsletterList(language),
      newsMediaItemsByYear: await getNewsMediaItemList(language)
    };
    res.json(newsCombined);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
