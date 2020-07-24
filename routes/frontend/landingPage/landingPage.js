const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const getPageMetaForFrontEnd = require('../../../utils/pageMeta/getPageMetaForFrontEnd');
const {
  LandingPage,
  landingPageResponseTypes
} = require('../../../models/LandingPage');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const landingSelect = {
  lastModifyDT: 0,
  lastModifyUser: 0
};

const landingPopulationList = [
  {
    path: 'featuredVideo',
    select: mediumSelect
  },
  {
    path: 'featuredVideo2',
    select: mediumSelect
  },
  {
    path: 'featuredArtists',
    select: {
      label: 1,
      name_tc: 1,
      name_sc: 1,
      name_en: 1,
      featuredImage: 1
    },
    populate: {
      path: 'featuredImage',
      select: mediumSelect
    }
  },
  {
    path: 'pageMeta.ogImage',
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

    const landingForFrontEnd = {
      featuredVideo: {
        src: landing.featuredVideo && landing.featuredVideo.url
      },
      featuredVideo2: {
        src: landing.featuredVideo2 && landing.featuredVideo2.url
      },
      featuredArtists: getArraySafe(landing.featuredArtists).map(artist => ({
        id: artist._id,
        label: artist.label,
        name: getEntityPropByLanguage(artist, 'name', language),
        featuredImage: {
          src: artist.featuredImage && artist.featuredImage.url
        }
      })),
      pageMeta: getPageMetaForFrontEnd(landing.pageMeta)
    };

    res.json(landingForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
