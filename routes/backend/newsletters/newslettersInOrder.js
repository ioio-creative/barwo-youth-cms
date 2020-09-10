const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const postOrderingHandling = require('../../../utils/ordering/postHandling');
const { Newsletter } = require('../../../models/Newsletter');

/* utilities */

const newsletterFind = {};

const newsletterSelect = {
  label: 1
};

const newsletterSort = {
  label: 1
};

/* end of utilities */

// Obsolete
// @route   GET api/backend/newsletters/newslettersInOrder
// @desc    Get all newsletters in order
// @access  Private
// Note: this route is used in frontend's NewslettersOrder
router.get('/', auth, async (req, res) => {
  await getOrderingHandling(
    res,
    Newsletter,
    true,
    newsletterFind,
    newsletterSelect,
    newsletterSort,
    [],
    true // not allow disabled newsletters
  );
});

// Obsolete
// @route   POST api/backend/newsletters/newslettersInOrder
// @desc    Update all newsletters' order
// @access  Private
router.post('/', auth, async (req, res) => {
  const { newsletters } = req.body;
  await postOrderingHandling(res, newsletters, Newsletter, true);
});

module.exports = router;
