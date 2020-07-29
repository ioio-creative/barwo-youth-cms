const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const postOrderingHandling = require('../../../utils/ordering/postHandling');
const {
  News,
  isValidNewsType,
  newsResponseTypes
} = require('../../../models/News');

/* utilities */

const newsFind = {};

const newsSelect = {
  label: 1
};

const newsSort = {
  label: 1
};

/* end of utilities */

// @route   GET api/backend/newses/newsesInOrder/:type
// @desc    Get all newses in order of a particular type
// @access  Private
router.get('/:type', auth, async (req, res) => {
  const type = req.params.type;

  if (!isValidNewsType(type)) {
    // 400 bad request
    return res.status(400).json({ errors: [newsResponseTypes.TYPE_INVALID] });
  }

  await getOrderingHandling(
    res,
    News,
    true,
    { ...newsFind, type },
    newsSelect,
    newsSort
  );
});

// @route   POST api/backend/newses/newsesInOrder
// @desc    Update all newses in order
// @access  Private
router.post('/', auth, async (req, res) => {
  const { newses } = req.body;
  await postOrderingHandling(res, newses, News, true);
});

module.exports = router;
