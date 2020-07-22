const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const postOrderingHandling = require('../../../utils/ordering/postHandling');
const { Artist, artDirectorTypes } = require('../../../models/Artist');

/* utilities */

const artistFind = {
  type: {
    $not: {
      $in: artDirectorTypes
    }
  },
  isEnabled: {
    $ne: false
  }
};

const artistSelect = {
  label: 1,
  order: 1
};

const artistSort = {
  order: 1,
  label: 1
};

/* end of utilities */

// @route   GET api/backend/artists/eventArtists
// @desc    Get all event artists
// @access  Private
// Note: this route is used in frontend's EventEdit and LandingPageEdit and ArtistsOrder
router.get('/', auth, async (req, res) => {
  await getOrderingHandling(res, Artist, artistFind, artistSelect, artistSort);
});

// @route   POST api/backend/artists/eventArtists/ordering
// @desc    Update all event artists' order
// @access  Private
router.post('/ordering', auth, async (req, res) => {
  const { artists } = req.body;
  await postOrderingHandling(res, artists, Artist);
});

module.exports = router;
