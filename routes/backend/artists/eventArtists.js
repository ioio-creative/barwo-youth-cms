const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const postOrderingHandling = require('../../../utils/ordering/postHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Artist, artDirectorTypes } = require('../../../models/Artist');

/* utilities */

const artistFind = {
  type: {
    $not: {
      $in: artDirectorTypes
    }
  }
};

const artistSelect = {
  label: 1
};

const artistSort = {
  label: 1
};

/* end of utilities */

// @route   GET api/backend/artists/eventArtists
// @desc    Get all event artists
// @access  Private
// Note: this route is used in frontend's EventEdit and LandingPageEdit
router.get('/', auth, async (req, res) => {
  try {
    // allow disabled artists
    const artists = await Artist.find(artistFind)
      .select(artistSelect)
      .sort(artistSort);

    res.json(artists);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/backend/artists/eventArtists/eventArtistsInOrder
// @desc    Get all event artists in order
// @access  Private
// Note: this route is used in frontend's ArtistsOrder
router.get('/eventArtistsInOrder', auth, async (req, res) => {
  await getOrderingHandling(
    res,
    Artist,
    true,
    artistFind,
    artistSelect,
    artistSort,
    [],
    true // not allow disabled artists
  );
});

// @route   POST api/backend/artists/eventArtists/eventArtistsInOrder
// @desc    Update all event artists' order
// @access  Private
router.post('/eventArtistsInOrder', auth, async (req, res) => {
  const { artists } = req.body;
  await postOrderingHandling(res, artists, Artist, true);
});

module.exports = router;
