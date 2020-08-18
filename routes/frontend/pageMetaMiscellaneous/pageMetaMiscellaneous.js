const express = require('express');
const router = express.Router();

const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const getPageMetaForFrontEnd = require('../../../utils/pageMeta/getPageMetaForFrontEnd');
const {
  PageMetaMiscellaneous,
  pageMetaMiscellaneousResponseTypes
} = require('../../../models/PageMetaMiscellaneous');
const mediumSelect = require('../common/mediumSelect');

/* utilities */

const pageMetaMiscellaneousSelect = {
  lastModifyDT: 0,
  lastModifyUser: 0
};

const pageMetaMiscellaneousPopulationList = [
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
  }
];

/* end of utilities */

// @route   GET api/frontend/pageMetaMiscellaneous/:lang/pageMetaMiscellaneous
// @desc    Get page meta miscellaneous
// @access  Public
router.get(
  '/:lang/pageMetaMiscellaneous',
  [languageHandling],
  async (req, res) => {
    try {
      const language = req.language;

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

      const defaultPageMeta = pageMetaMiscellaneous.landingPageMeta;

      const pageMetaMiscellaneousForFrontEnd = {
        landingPageMeta: getPageMetaForFrontEnd(
          pageMetaMiscellaneous.landingPageMeta,
          language
        ),
        aboutMeta: getPageMetaForFrontEnd(
          pageMetaMiscellaneous.aboutMeta,
          language,
          defaultPageMeta
        ),
        artistListMeta: getPageMetaForFrontEnd(
          pageMetaMiscellaneous.artistListMeta,
          language,
          defaultPageMeta
        ),
        eventListMeta: getPageMetaForFrontEnd(
          pageMetaMiscellaneous.eventListMeta,
          language,
          defaultPageMeta
        ),
        activityListMeta: getPageMetaForFrontEnd(
          pageMetaMiscellaneous.activityListMeta,
          language,
          defaultPageMeta
        ),
        newsListMeta: getPageMetaForFrontEnd(
          pageMetaMiscellaneous.newsListMeta,
          language,
          defaultPageMeta
        )
      };

      res.json(pageMetaMiscellaneousForFrontEnd);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;