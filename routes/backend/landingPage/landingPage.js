const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const {
  LandingPage,
  landingPageResponseTypes
} = require('../../../models/LandingPage');
const { Artist } = require('../../../models/Artist');
const { Activity } = require('../../../models/Activity');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const landingSelect = {};

const landingPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },
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
    select: 'label'
  },
  {
    path: 'featuredActivities',
    select: 'label'
  },
  {
    path: 'pageMeta.ogImage',
    select: mediumSelect
  }
];

const landingPageFeaturedArtistsValidation = featuredArtists => {
  for (const featuredArtist of getArraySafe(featuredArtists)) {
    // featuredArtist is the _id
    if (!featuredArtist) {
      return landingPageResponseTypes.LANDING_PAGE_ARTIST_REQUIRED;
    }
  }
  return null;
};

const landingPageFeaturedActivitiesValidation = featuredActivities => {
  for (const featuredActivity of getArraySafe(featuredActivities)) {
    // featuredActivity is the _id
    if (!featuredActivity) {
      return landingPageResponseTypes.LANDING_PAGE_ACTIVITY_REQUIRED;
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

const landingPageRelationshipsValidation = (
  featuredArtists,
  featuredActivities,
  res
) => {
  let errorType = null;

  errorType = landingPageFeaturedArtistsValidation(featuredArtists);
  if (errorType) {
    handleLandingPageRelationshipsValidationError(errorType, res);
    return false;
  }

  errorType = landingPageFeaturedActivitiesValidation(featuredActivities);
  if (errorType) {
    handleLandingPageRelationshipsValidationError(errorType, res);
    return false;
  }

  return true;
};

const setIsFeaturedInLandingPageForArtistsAndActivities = async (
  landing,
  session
) => {
  // https://stackoverflow.com/questions/55264112/mongoose-many-to-many-relations

  const options = { session };

  // set artist's isFeaturedInLandingPage
  for (const featuredArtist of getArraySafe(landing.featuredArtists)) {
    // featuredArtist is the _id
    await Artist.findByIdAndUpdate(
      featuredArtist,
      {
        isFeaturedInLandingPage: true
      },
      options
    );
  }

  // set activity's isFeaturedInLandingPage
  for (const featuredActivity of getArraySafe(landing.featuredActivities)) {
    // featuredActivity is the _id
    await Activity.findByIdAndUpdate(
      featuredActivity,
      {
        isFeaturedInLandingPage: true
      },
      options
    );
  }
};

const removeIsFeaturedInLandingPageForAndArtistsAndActivities = async (
  landing,
  session
) => {
  const options = { session };

  for (const featuredArtist of getArraySafe(landing.featuredArtists)) {
    await Artist.findByIdAndUpdate(
      featuredArtist,
      {
        isFeaturedInLandingPage: false
      },
      options
    );
  }

  for (const featuredActivity of getArraySafe(landing.featuredActivities)) {
    await Activity.findByIdAndUpdate(
      featuredActivity,
      {
        isFeaturedInLandingPage: false
      },
      options
    );
  }
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
  const {
    featuredVideo,
    featuredVideo2,
    featuredArtists,
    featuredActivities,
    pageMeta
  } = req.body;

  // customed validations
  let isSuccess = landingPageRelationshipsValidation(
    featuredArtists,
    featuredActivities,
    res
  );
  if (!isSuccess) {
    return;
  }

  // Build landing object
  // Note:
  // non-required fields do not need null check
  const landingFields = {};
  landingFields.featuredVideo = featuredVideo;
  landingFields.featuredVideo2 = featuredVideo2;
  landingFields.featuredArtists = getArraySafe(featuredArtists);
  landingFields.featuredActivities = getArraySafe(featuredActivities);
  landingFields.pageMeta = pageMeta;
  landingFields.lastModifyDT = new Date();
  landingFields.lastModifyUser = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const oldLanding = await LandingPage.findOne({}).session(session);
    let newLanding = null;

    if (oldLanding) {
      // update flow
      await removeIsFeaturedInLandingPageForAndArtistsAndActivities(
        oldLanding,
        session
      );

      newLanding = await LandingPage.findOneAndUpdate(
        {},
        { $set: landingFields },
        { session, new: true }
      );
    } else {
      // insert flow
      newLanding = new LandingPage(landingFields);

      await newLanding.save({ session });
    }

    await setIsFeaturedInLandingPageForArtistsAndActivities(
      newLanding,
      session
    );

    await session.commitTransaction();

    res.json(newLanding);
  } catch (err) {
    await session.abortTransaction();
    generalErrorHandle(err, res);
  } finally {
    session.endSession();
  }
});

module.exports = router;
