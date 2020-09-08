const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const frontEndDetailPageApiLabelHandling = require('../../../middleware/frontEndDetailPageApiLabelHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const distinct = require('../../../utils/js/array/distinct');
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
  defaultActivityType,
  isValidActivityType,
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
  }
];

const activityPopulationListForFindOne = [
  ...activityPopulationListForFindAll,
  {
    path: 'gallery',
    select: mediumSelect
  },
  // {
  //   path: 'downloadMedium',
  //   select: mediumSelect
  // },
  pageMetaPopulate
];

const getActivityForFrontEndFromDbActivity = (
  activity,
  language,
  isRequireDetail = false,
  defaultPageMeta = {}
) => {
  const name = getEntityPropByLanguage(activity, 'name', language);

  let nameForLongDisplay = getEntityPropByLanguage(
    activity,
    'nameForLongDisplay',
    language
  );
  nameForLongDisplay = nameForLongDisplay
    ? nameForLongDisplay.replace(/\n/g, '<br>')
    : name;

  let detailData = {};

  if (isRequireDetail) {
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

    detailData = {
      description: getEntityPropByLanguage(activity, 'desc', language),
      gallery: getArraySafe(activity.gallery).map(medium => {
        return {
          src: medium && medium.url
        };
      }),
      videoLinks: getArraySafe(activity.videoLinks),
      //download: download,
      pageMeta: getPageMetaForFrontEnd(
        activity.pageMeta,
        language,
        defaultPageMeta
      )
    };
  }

  return {
    id: activity._id,
    label: cleanLabelForSendingToFrontEnd(activity.label),
    name: name,
    nameForLongDisplay: nameForLongDisplay,
    section: activity.type,
    date: {
      from: formatDateStringForFrontEnd(activity.fromDate),
      to: formatDateStringForFrontEnd(activity.toDate)
    },
    location: getEntityPropByLanguage(activity, 'location', language),
    featuredImage: {
      src: activity.featuredImage && activity.featuredImage.url
    },
    ...detailData
  };
};

/* end of utilities */

// Note: this api route is currently not used
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

// @route   GET api/frontend/activities/:lang/activityTypes
// @desc    Get all activity types, to which some activities belong
// @access  Public
router.get('/:lang/activityTypes', [languageHandling], async (req, res) => {
  try {
    //const language = req.language;

    const activities = await Activity.find({
      isEnabled: {
        $ne: false
      }
    })
      .select(activitySelectForFindAll)
      .populate(activityPopulationListForFindAll);

    const safeActivities = getArraySafe(activities);

    const types = distinct(safeActivities.map(activity => activity.type));

    const activityTypesToInclude = activityTypesInOrder.map(type => ({
      type,
      isIncluded: false
    }));

    activityTypesToInclude.forEach((activityTypeToInclude, idx) => {
      activityTypeToInclude.isIncluded = types.includes(
        activityTypeToInclude.type
      );
    });

    const activityTypesToReturn = activityTypesToInclude
      .filter(x => x.isIncluded)
      .map(x => x.type);

    res.json(activityTypesToReturn);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/activities/:lang/activitiesByType
// @desc    Get all activities of a specific type
// @access  Public
// @query   type=YOUTH_PROGRAMME or GUIDED_TALK, etc.
router.get('/:lang/activitiesByType', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    // query
    const query = req.query;
    let type = query.type && query.type.toUpperCase();

    if (!isValidActivityType(type)) {
      type = defaultActivityType;
    }

    const activities = await Activity.find({
      isEnabled: {
        $ne: false
      },
      type
    })
      .select(activitySelectForFindAll)
      .populate(activityPopulationListForFindAll);

    const safeActivities = getArraySafe(activities);

    // set activitiesOfTypeForFrontEnd
    const { sortedActivities } = mapAndSortActivities(
      safeActivities,
      activity => {
        return getActivityForFrontEndFromDbActivity(activity, language);
      },
      -1
    );

    res.json(sortedActivities);
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
