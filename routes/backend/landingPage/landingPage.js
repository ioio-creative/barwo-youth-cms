const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const {
  LandingPage,
  landingPageResponseTypes
} = require('../../../models/LandingPage');

/* utilities */

const landingSelect = {};

const landingPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
  {
    path: 'featuredVideo',
    select: {
      usages: 0,
      isEnabled: 0,
      createDT: 0,
      lastModifyDT: 0,
      lastModifyUser: 0
    }
  },
  {
    path: 'featuredVideo2',
    select: {
      usages: 0,
      isEnabled: 0,
      createDT: 0,
      lastModifyDT: 0,
      lastModifyUser: 0
    }
  },
  {
    path: 'featuredArtists',
    select: 'label'
  }
];

const landingPageArtistsValidation = artists => {
  for (const artist of getArraySafe(artists)) {
    // artist is the _id
    if (!artist) {
      return landingPageResponseTypes.LANDING_PAGE_ARTIST_REQUIRED;
    }
  }
  return null;
};

const handleLandingPageRelationshipsValidationError = (errorType, res) => {
  // 400 bad request
  res.status(400).json({
    errors: [errorType]
  });
};

const landingPageRelationshipsValidation = (artists, res) => {
  let errorType = null;

  errorType = landingPageArtistsValidation(artists);
  if (errorType) {
    handleLandingPageRelationshipsValidationError(errorType, res);
    return false;
  }

  return true;
};

/* end of utilities */

// @route   GET api/backend/landingPage/landingPage
// @desc    Get landing page
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const landing = await LandingPage.findOne({})
      .select(landingSelect)
      .populate(landingPopulationList);
    if (!landing) {
      return res
        .status(404)
        .json({ errors: [landingPageResponseTypes.LANDING_PAGE_NOT_EXISTS] });
    }
    res.json(landing);
  } catch (err) {
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [landingPageResponseTypes.LANDING_PAGE_NOT_EXISTS] });
  }
});

// @route   POST api/backend/landingPage/landingPage
// @desc    Add landing page
// @access  Private
router.post('/', [auth], async (req, res) => {
  const { featuredVideo, featuredVideo2, featuredArtists } = req.body;
  console.log(req.body);

  // Build landing object
  // Note:
  // non-required fields do not need null check
  const landingFields = {};
  landingFields.featuredVideo = featuredVideo;
  landingFields.featuredVideo2 = featuredVideo2;
  landingFields.featuredArtists = getArraySafe(featuredArtists);
  landingFields.lastModifyDT = new Date();
  landingFields.lastModifyUser = req.user._id;

  // customed validations
  let isSuccess = landingPageRelationshipsValidation();

  try {
    const oldLanding = await LandingPage.findOne({});
    let newLanding = null;

    if (oldLanding) {
      // update flow
      newLanding = await LandingPage.findOneAndUpdate(
        {},
        { $set: landingFields }
      );
    } else {
      // insert flow
      newLanding = new LandingPage(landingFields);

      await newLanding.save();
    }

    res.json(newLanding);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
