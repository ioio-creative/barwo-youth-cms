const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { shuffleInPlace } = require('../../../utils/js/array/shuffle');
const { formatDateStringForFrontEnd } = require('../../../utils/datetime');
const cleanLabelForSendingToFrontEnd = require('../../../utils/label/cleanLabelForSendingToFrontEnd');
const {
  LandingPage,
  landingPageResponseTypes
} = require('../../../models/LandingPage');
const { Artist, artDirectorTypes } = require('../../../models/Artist');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const maxNumOfFeaturedArtists = 10;

const landingSelect = {
  lastModifyDT: 0,
  lastModifyUser: 0
};

const landingPopulationList = [
  {
    path: 'landingVideos',
    select: mediumSelect
  },
  {
    path: 'featuredVideo1',
    select: mediumSelect
  },
  // {
  //   path: 'featuredVideo2',
  //   select: mediumSelect
  // },
  // {
  //   path: 'featuredArtists',
  //   select: {
  //     label: 1,
  //     name_tc: 1,
  //     name_sc: 1,
  //     name_en: 1,
  //     featuredImage: 1
  //   },
  //   populate: {
  //     path: 'featuredImage',
  //     select: mediumSelect
  //   }
  // },
  {
    path: 'featuredActivities',
    select: {
      label: 1,
      name_tc: 1,
      name_sc: 1,
      name_en: 1,
      nameForLongDisplay_tc: 1,
      nameForLongDisplay_sc: 1,
      nameForLongDisplay_en: 1,
      type: 1,
      fromDate: 1,
      toDate: 1,
      featuredImage: 1
    },
    populate: {
      path: 'featuredImage',
      select: mediumSelect
    }
  }
];

const artistSelect = {
  label: 1,
  name_tc: 1,
  name_sc: 1,
  name_en: 1,
  featuredImage: 1
};

const artistPopulationList = [
  {
    path: 'featuredImage',
    select: mediumSelect
  }
];

/* end of utilities */

// @route   GET api/frontend/landingPage/:lang/landingPage
// @desc    Get landing page
// @access  Public
router.get('/:lang/landingPage', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const landing = await LandingPage.findOne({})
      .select(landingSelect)
      .populate(landingPopulationList);

    if (!landing) {
      return res
        .status(404)
        .json({ errors: [landingPageResponseTypes.LANDING_PAGE_NOT_EXISTS] });
    }

    let featuredArtists = await Artist.find({
      isEnabled: {
        $ne: false
      },
      type: {
        $not: {
          $in: artDirectorTypes
        }
      }
    })
      .select(artistSelect)
      .populate(artistPopulationList);

    featuredArtists = getArraySafe(featuredArtists).splice(
      0,
      maxNumOfFeaturedArtists
    );

    featuredArtists = shuffleInPlace(featuredArtists);

    const landingForFrontEnd = {
      landingVideos: getArraySafe(landing.landingVideos).map(video => ({
        src: video && video.url
      })),
      featuredVideo1: {
        src: landing.featuredVideo1 && landing.featuredVideo1.url
      },
      // featuredVideo2: {
      //   src: landing.featuredVideo2 && landing.featuredVideo2.url
      // },
      featuredArtists: getArraySafe(
        /*landing.featuredArtists*/ featuredArtists
      ).map(artist => ({
        id: artist._id,
        label: cleanLabelForSendingToFrontEnd(artist.label),
        name: getEntityPropByLanguage(artist, 'name', language),
        featuredImage: {
          src: artist.featuredImage && artist.featuredImage.url
        }
      })),
      featuredActivities: getArraySafe(landing.featuredActivities).map(
        activity => {
          const name = getEntityPropByLanguage(activity, 'name', language);
          let nameForLongDisplay = getEntityPropByLanguage(
            activity,
            'nameForLongDisplay',
            language
          );
          nameForLongDisplay = nameForLongDisplay
            ? nameForLongDisplay.replace(/\n/g, '<br>')
            : name;
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
            featuredImage: {
              src: activity.featuredImage && activity.featuredImage.url
            }
          };
        }
      )
    };

    res.json(landingForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
