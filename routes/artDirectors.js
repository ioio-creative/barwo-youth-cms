const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { generalErrorHandle } = require('../utils/errorHandling');
const { Artist, artistTypes } = require('../models/Artist');

// @route   GET api/artDirectors
// @desc    Get all art directors
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const artDirectors = await Artist.find({
      // https://stackoverflow.com/questions/45842338/mongoose-error-cant-use-or-with-string
      type: {
        $in: [artistTypes.ART_DIRECTOR, artistTypes.ART_DIRECTOR_VISITING]
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
    res.json(artDirectors);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
