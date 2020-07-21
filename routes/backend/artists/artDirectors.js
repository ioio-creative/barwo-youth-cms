const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { Artist, artDirectorTypes } = require('../../../models/Artist');

/* utilities */

const artDirectorFind = {
  // https://stackoverflow.com/questions/45842338/mongoose-error-cant-use-or-with-string
  type: {
    $in: artDirectorTypes
  },
  isEnabled: {
    $ne: false
  }
};

const artDirectorSelect = {
  label: 1,
  order: 1
};

const artDirectorSort = {
  order: 1,
  label: 1
};

/* end of utilities */

// @route   GET api/backend/artists/artDirectors
// @desc    Get all art directors
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // https://stackoverflow.com/questions/15267544/how-are-null-values-in-a-mongodb-index-sorted
    const artDirectorsWithNullOrder = await Artist.find({
      ...artDirectorFind,
      order: {
        $in: [null, undefined]
      }
    })
      .select(artDirectorSelect)
      .sort(artDirectorSort);
    const artDirectorsWithNonNullOrder = await Artist.find({
      ...artDirectorFind,
      order: {
        $not: {
          $in: [null, undefined]
        }
      }
    })
      .select(artDirectorSelect)
      .sort(artDirectorSort);

    res.json(artDirectorsWithNonNullOrder.concat(artDirectorsWithNullOrder));
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

router.post('/ordering', auth, async (req, res) => {
  const { artDirectors } = req.body;
  const safeArtDirectors = getArraySafe(artDirectors);

  if (safeArtDirectors.length === 0) {
    res.sendStatus(200);
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (let i = 0; i < safeArtDirectors.length; i++) {
      const artDirector = safeArtDirectors[i];
      await Artist.findByIdAndUpdate(
        artDirector._id,
        {
          $set: { order: i }
        },
        { session, new: true }
      );
    }

    await session.commitTransaction();

    res.sendStatus(200);
  } catch (err) {
    await session.abortTransaction();
    generalErrorHandle(err, res);
  }
});

module.exports = router;
