const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Artist, artistTypes } = require('../../../models/Artist');

// @route   GET api/backend/artists/eventArtists
// @desc    Get all event artists
// @access  Private
// Note: this route is used in frontend's EventEdit and LandingPageEdit
router.get('/', auth, async (req, res) => {
  try {
    const artists = await Artist.find({
      type: {
        $in: [artistTypes.ACTOR, artistTypes.ACTOR_PAST]
      },
      isEnabled: {
        $ne: false
      }
    })
      .select({
        label: 1
      })
      .sort({
        label: 1
      });
    res.json(artists);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
