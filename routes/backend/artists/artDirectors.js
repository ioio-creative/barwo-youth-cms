const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const postOrderingHandling = require('../../../utils/ordering/postHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
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
// Note: this route is used in frontend's EventEdit
router.get('/', auth, async (req, res) => {
  try {
    // allow disabled art directors
    const artDirectors = await Artist.find(artDirectorFind)
      .select(artDirectorSelect)
      .sort(artDirectorSort);

    res.json(artDirectors);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/backend/artists/artDirectors/ordering
// @desc    Get all art directors in order
// @access  Private
// Note: this route is used in frontend's ArtDirectorsOrder
router.get('/ordering', auth, async (req, res) => {
  await getOrderingHandling(
    res,
    Artist,
    true,
    artDirectorFind,
    artDirectorSelect,
    artDirectorSort,
    [],
    true // not allow disabled art directors
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
