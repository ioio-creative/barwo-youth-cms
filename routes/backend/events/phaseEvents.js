const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Event } = require('../../../models/Event');

// @route   GET api/backend/events/phaseArtists
// @desc    Get all phase events
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({
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
    res.json(events);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
