const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { formatDateStringForFrontEnd } = require('../../../utils/datetime');
const mapAndSortActivities = require('../../../utils/activities/mapAndSortActivities');
const { mediumLinkTypes } = require('../../../types/mediumLink');
const { Activity } = require('../../../models/Activity');

/* utilities */

const activitySelectForFindAll = {
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0
};

const activitySelectForFindOne = { ...activitySelectForFindAll };

const activityPopulationListForFindAll = [
  {
    path: 'featuredImage',
    select: {
      url: 1
    }
  },
  {
    path: 'gallery',
    select: {
      url: 1
    }
  },
  {
    path: 'downloadMedium',
    select: {
      url: 1
    }
  }
];

const activityPopulationListForFindOne = [...activityPopulationListForFindAll];

const getActivityForFrontEndFromDbActivity = (activity, language) => {
  let download = '';
  switch (activity.downloadType) {
    case mediumLinkTypes.URL:
      download = getEntityPropByLanguage(activity, 'downloadUrl', language);
      break;
    case mediumLinkTypes.MEDIUM:
    default:
      download = activity.downloadMedium && activity.downloadMedium.url;
      break;
  }
  return {
    id: activity._id,
    label: activity.label,
    name: getEntityPropByLanguage(activity, 'name', language),
    section: activity.type,
    date: {
      from: formatDateStringForFrontEnd(activity.fromDate),
      to: formatDateStringForFrontEnd(activity.toDate)
    },
    location: getEntityPropByLanguage(activity, 'location', language),
    description: getEntityPropByLanguage(activity, 'description', language),
    featuredImage: {
      src: activity.featuredImage && activity.featuredImage.url
    },
    gallery: getArraySafe(activity.gallery).map(medium => {
      return {
        src: medium && medium.url
      };
    }),
    download: download
  };
};

/* end of utilities */

// @route   GET api/frontend/activities/:lang/activities
// @desc    Get all activities
// @access  Public
router.get('/:lang/activities', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const activities = await Activity.find({
      isEnabled: true
    })
      .select(activitySelectForFindAll)
      .populate(activityPopulationListForFindAll);

    const { sortedActivities } = mapAndSortActivities(activities, activity => {
      return getActivityForFrontEndFromDbActivity(activity, language);
    });

    res.json(sortedActivities);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/activities/:lang/activities/:label
// @desc    Get activity by label
// @access  Public
router.get('/:lang/activities/:label', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const activity = await Activity.findOne({
      label: req.params.label
    })
      .select(activitySelectForFindOne)
      .populate(activityPopulationListForFindOne);

    const activityForFrontEnd = getActivityForFrontEndFromDbActivity(
      activity,
      language
    );

    res.json(activityForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
