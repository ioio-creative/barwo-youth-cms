const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const postOrderingHandling = require('../../../utils/ordering/postHandling');
const { News } = require('../../../models/News');

/* utilities */

const newsFind = {
  isEnabled: {
    $ne: false
  }
};

const newsSelect = {
  label: 1,
  order: 1
};

const newsSort = {
  order: 1,
  label: 1
};

/* end of utilities */

// @route   GET api/backend/newses/newsesInOrder
// @desc    Get all newses in order
// @access  Private
router.get('/', auth, async (req, res) => {
  await getOrderingHandling(res, News, newsFind, newsSelect, newsSort);
});

// @route   POST api/backend/newses/newsesInOrder
// @desc    Update all newses in order
// @access  Private
router.post('/', auth, async (req, res) => {
  const { newses } = req.body;
  await postOrderingHandling(res, newses, News);
});

module.exports = router;
