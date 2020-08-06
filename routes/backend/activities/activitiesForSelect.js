const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Activity } = require('../../../models/Activity');

/* utilities */

const activityFind = {};

const activitySelect = {
  label: 1
};

const activitySort = {
  label: 1
};

/* end of utilities */

// @route   GET api/backend/activities/activitiesForSelect
// @desc    Get all activities for select
// @access  Private
// Note: this route is used in frontend's LandingPageEdit
router.get('/', auth, async (req, res) => {
  try {
    // allow disabled activities
    const activities = await Activity.find(activityFind)
      .select(activitySelect)
      .sort(activitySort);

    res.json(activities);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
