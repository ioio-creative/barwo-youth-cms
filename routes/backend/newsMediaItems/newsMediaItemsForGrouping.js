const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { NewsMediaItem } = require('../../../models/NewsMediaItem');

/* utilities */

const newsMediaItemFind = {};

const newsMediaItemSelect = {
  label: 1
};

const newsMediaItemSort = {
  label: 1
};

/* end of utilities */

// @route   GET api/backend/newsMediaItems/newsMediaItemsForGrouping
// @desc    Get all news media items for grouping
// @access  Private
// Note: this route is used in frontend's NewsMediaItemEdit
router.get('/', auth, async (req, res) => {
  try {
    // allow disabled news media items
    // actually news media items do not have isEnabled field
    const newsMediaItems = await Artist.find(newsMediaItemFind)
      .select(newsMediaItemSelect)
      .sort(newsMediaItemSort);

    res.json(newsMediaItems);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
