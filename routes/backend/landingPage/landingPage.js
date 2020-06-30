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
  }
];

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
  const { featuredVideo, featuredVideo2 } = req.body;

  // Build landing object
  // Note:
  // non-required fields do not need null check
  const landingFields = {};
  landingFields.featuredVideo = featuredVideo;
  landingFields.featuredVideo2 = featuredVideo2;
  landingFields.lastModifyDT = new Date();
  landingFields.lastModifyUser = req.user._id;

  try {
    const oldLanding = await LandingPage.findOne({});
    const newLanding = null;

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
