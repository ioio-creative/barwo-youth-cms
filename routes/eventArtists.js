const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { generalErrorHandle } = require('../utils/errorHandling');
const { Artist, artistTypes } = require('../models/Artist');

// @route   GET api/eventArtists
// @desc    Get all event artists
// @access  Private
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
        name_tc: 1
      })
      .sort({
        lastModifyDT: -1
      });
    res.json(artists);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
