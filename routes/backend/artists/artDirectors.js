const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const postOrderingHandling = require('../../../utils/ordering/postHandling');
const { Artist, artDirectorTypes } = require('../../../models/Artist');

/* utilities */

const artDirectorFind = {
  // https://stackoverflow.com/questions/45842338/mongoose-error-cant-use-or-with-string
  type: {
    $in: artDirectorTypes
  }
};

const artDirectorSelect = {
  label: 1
};

const artDirectorSort = {
  label: 1
};

/* end of utilities */

// @route   GET api/backend/artists/artDirectors
// @desc    Get all art directors
// @access  Private
router.get('/', auth, async (req, res) => {
  await getOrderingHandling(
    res,
    Artist,
    true,
    artDirectorFind,
    artDirectorSelect,
    artDirectorSort
  );
});

// @route   POST api/backend/artists/artDirectors/ordering
// @desc    Update all art directors' order
// @access  Private
router.post('/ordering', auth, async (req, res) => {
  const { artDirectors } = req.body;
  await postOrderingHandling(res, artDirectors, Artist, true);
});

module.exports = router;
