const express = require('express');
const router = express.Router();

const {
  LandingPage,
  landingPageResponseTypes
} = require('../../../models/LandingPage');

/* utilities */

const landingSelect = {
  lastModifyDT: 0,
  lastModifyUser: 0
};

const landingPopulationList = [
  {
    path: 'featuredVideo',
    select: {
      url: 1
    }
  },
  {
    path: 'featuredVideo2',
    select: {
      url: 1
    }
  }
];

/* end of utilities */

// @route   GET api/frontend/landingPage/landingPage
// @desc    Get landing page
// @access  Public
router.get('/', async (req, res) => {
  try {
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
      }
    };

    res.json(landingForFrontEnd);
  } catch (err) {
    //generalErrorHandle(err, res);
    console.log(err);
    return res
      .status(404)
      .json({ errors: [landingPageResponseTypes.LANDING_PAGE_NOT_EXISTS] });
  }
});

module.exports = router;
