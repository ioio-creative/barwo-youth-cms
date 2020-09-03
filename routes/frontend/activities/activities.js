const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const frontEndDetailPageApiLabelHandling = require('../../../middleware/frontEndDetailPageApiLabelHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { formatDateStringForFrontEnd } = require('../../../utils/datetime');
const mapAndSortActivities = require('../../../utils/activities/mapAndSortActivities');
const cleanLabelForSendingToFrontEnd = require('../../../utils/label/cleanLabelForSendingToFrontEnd');
//const { mediumLinkTypes } = require('../../../types/mediumLink');
const {
  getPageMetaForFrontEnd,
  getMixedPageMetas
} = require('../../../models/PageMeta');
const {
  Activity,
  activityTypesInOrder,
  activityResponseTypes
} = require('../../../models/Activity');
const mediumSelect = require('../common/mediumSelect');
const pageMetaPopulate = require('../common/pageMetaPopulate');
const {
  getPageMetaMiscellaneousFromDb
} = require('../pageMetaMiscellaneous/pageMetaMiscellaneous');

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
    select: mediumSelect
  },
  {
    path: 'gallery',
    select: mediumSelect
  },
  // {
  //   path: 'downloadMedium',
  //   select: mediumSelect
  // }
  pageMetaPopulate
];

const activityPopulationListForFindOne = [...activityPopulationListForFindAll];

const getActivityForFrontEndFromDbActivity = (
  activity,
  language,
  isRequirePageMeta = false,
  defaultPageMeta = {}
) => {
  // let download = '';
  // switch (activity.downloadType) {
  //   case mediumLinkTypes.URL:
  //     download = getEntityPropByLanguage(activity, 'downloadUrl', language);
  //     break;
  //   case mediumLinkTypes.MEDIUM:
  //   default:
  //     download = activity.downloadMedium && activity.downloadMedium.url;
  //     break;
  // }
  return {
    id: activity._id,
    label: cleanLabelForSendingToFrontEnd(activity.label),
    name: getEntityPropByLanguage(activity, 'name', language),
    section: activity.type,
    date: {
      from: formatDateStringForFrontEnd(activity.fromDate),
      to: formatDateStringForFrontEnd(activity.toDate)
    },
    location: getEntityPropByLanguage(activity, 'location', language),
    description: getEntityPropByLanguage(activity, 'desc', language),
    featuredImage: {
      src: activity.featuredImage && activity.featuredImage.url
    },
    gallery: getArraySafe(activity.gallery).map(medium => {
      return {
        src: medium && medium.url
      };
    }),
    //download: download
    pageMeta:
      isRequirePageMeta &&
      getPageMetaForFrontEnd(activity.pageMeta, language, defaultPageMeta)
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
      isEnabled: {
        $ne: false
      }
    })
      .select(activitySelectForFindAll)
      .populate(activityPopulationListForFindAll);

    const safeActivities = getArraySafe(activities);

    const activitiesByTypeInTypeOrder = [];

    for (const type of activityTypesInOrder) {
      const activitiesOfType = safeActivities.filter(
        activity => activity.type === type
      );

      // set activitiesOfTypeForFrontEnd
      const { sortedActivities } = mapAndSortActivities(
        activitiesOfType,
        activity => {
          return getActivityForFrontEndFromDbActivity(activity, language);
        },
        -1
      );

      activitiesByTypeInTypeOrder.push({
        type,
        activities: sortedActivities
      });
    }

    res.json(activitiesByTypeInTypeOrder);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/activities/:lang/activities/:label
// @desc    Get activity by label
// @access  Public
router.get(
  '/:lang/activities/:label',
  [languageHandling, frontEndDetailPageApiLabelHandling],
  async (req, res) => {
    try {
      const label = req.detailItemLabel;
      const language = req.language;

      const pageMetaMiscellaneous = await getPageMetaMiscellaneousFromDb(
        true,
        res
      );
      if (!pageMetaMiscellaneous) {
        return;
      }

      const defaultPageMeta = getMixedPageMetas(
        pageMetaMiscellaneous.activityListMeta,
        pageMetaMiscellaneous.landingPageMeta
      );

      const activity = await Activity.findOne({
        label: label
      })
        .select(activitySelectForFindOne)
        .populate(activityPopulationListForFindOne);

      if (!activity) {
        return res
          .status(404)
          .json({ errors: [activityResponseTypes.ACTIVITY_NOT_EXISTS] });
      }

      const activityForFrontEnd = getActivityForFrontEndFromDbActivity(
        activity,
        language,
        true,
        defaultPageMeta
      );

      res.json(activityForFrontEnd);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
