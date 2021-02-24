const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const {
  PageMetaMiscellaneous,
  pageMetaMiscellaneousResponseTypes
} = require('../../../models/PageMetaMiscellaneous');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const pageMetaMiscellaneousSelect = {};

const pageMetaMiscellaneousPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  },

  {
    path: 'landingPageMeta.ogImage',
    select: mediumSelect
  },
  {
    path: 'aboutMeta.ogImage',
    select: mediumSelect
  },
  {
    path: 'artistListMeta.ogImage',
    select: mediumSelect
  },
  {
    path: 'eventListMeta.ogImage',
    select: mediumSelect
  },
  {
    path: 'activityListMeta.ogImage',
    select: mediumSelect
  },
  {
    path: 'newsListMeta.ogImage',
    select: mediumSelect
  },
  {
    path: 'mediaListMeta.ogImage',
    select: mediumSelect
  },
  {
    path: 'recruitmentMeta.ogImage',
    select: mediumSelect
  }
];

/* end of utilities */

// @route   GET api/backend/pageMetaMiscellaneous/pageMetaMiscellaneous
// @desc    Get page meta miscellaneous
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const pageMetaMiscellaneous = await PageMetaMiscellaneous.findOne({})
      .select(pageMetaMiscellaneousSelect)
      .populate(pageMetaMiscellaneousPopulationList);
    if (!pageMetaMiscellaneous) {
      return res.status(404).json({
        errors: [
          pageMetaMiscellaneousResponseTypes.PAGE_META_MISCELLANEOUS_NOT_EXISTS
        ]
      });
    }
    res.json(pageMetaMiscellaneous);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   POST api/backend/pageMetaMiscellaneous/pageMetaMiscellaneous
// @desc    Add page meta miscellaneous
// @access  Private
router.post('/', [auth], async (req, res) => {
  const {
    landingPageMeta,
    aboutMeta,
    artistListMeta,
    eventListMeta,
    activityListMeta,
    newsListMeta,
    mediaListMeta,
    recruitmentMeta
  } = req.body;

  // Build page meta miscellaneous object
  // Note:
  // non-required fields do not need null check
  const pageMetaMiscellaneousFields = {};
  pageMetaMiscellaneousFields.landingPageMeta = landingPageMeta;
  pageMetaMiscellaneousFields.aboutMeta = aboutMeta;
  pageMetaMiscellaneousFields.artistListMeta = artistListMeta;
  pageMetaMiscellaneousFields.eventListMeta = eventListMeta;
  pageMetaMiscellaneousFields.activityListMeta = activityListMeta;
  pageMetaMiscellaneousFields.newsListMeta = newsListMeta;
  pageMetaMiscellaneousFields.mediaListMeta = mediaListMeta;
  pageMetaMiscellaneousFields.recruitmentMeta = recruitmentMeta;
  
  pageMetaMiscellaneousFields.lastModifyDT = new Date();
  pageMetaMiscellaneousFields.lastModifyUser = req.user._id;

  try {
    const oldPageMetaMiscellaneous = await PageMetaMiscellaneous.findOne({});
    let newPageMetaMiscellaneous = null;

    if (oldPageMetaMiscellaneous) {
      // update flow
      newPageMetaMiscellaneous = await PageMetaMiscellaneous.findOneAndUpdate(
        {},
        { $set: pageMetaMiscellaneousFields },
        { new: true }
      );
    } else {
      // insert flow
      newPageMetaMiscellaneous = new PageMetaMiscellaneous(
        pageMetaMiscellaneousFields
      );

      await newPageMetaMiscellaneous.save();
    }

    res.json(newPageMetaMiscellaneous);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
