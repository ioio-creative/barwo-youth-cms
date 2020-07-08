const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Artist, artDirectorTypes } = require('../../../models/Artist');

// @route   GET api/backend/artists/artDirectors
// @desc    Get all art directors
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const artDirectors = await Artist.find({
      // https://stackoverflow.com/questions/45842338/mongoose-error-cant-use-or-with-string
      type: {
        $in: artDirectorTypes
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
    res.json(artDirectors);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
