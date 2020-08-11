const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Event, eventTypes } = require('../../../models/Event');

// @route   GET api/backend/events/phaseArtists
// @desc    Get all phase events
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // allow disabled events
    const events = await Event.find({
      type: eventTypes.EVENT
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
