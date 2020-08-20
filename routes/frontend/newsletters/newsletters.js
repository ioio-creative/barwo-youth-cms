const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const frontEndDetailPageApiLabelHandling = require('../../../middleware/frontEndDetailPageApiLabelHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const cleanLabelForSendingToFrontEnd = require('../../../utils/label/cleanLabelForSendingToFrontEnd');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const {
  getPageMetaForFrontEnd,
  getMixedPageMetas
} = require('../../../models/PageMeta');
const {
  Newsletter,
  newsletterResponseTypes
} = require('../../../models/Newsletter');
const mediumSelect = require('../common/mediumSelect');
const pageMetaPopulate = require('../common/pageMetaPopulate');
const {
  getPageMetaMiscellaneousFromDb
} = require('../pageMetaMiscellaneous/pageMetaMiscellaneous');

const newsletterSelectForFindAll = {
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0,

  message_tc: 0,
  message_sc: 0,
  message_en: 0
};

const newsletterSelectForFindOne = {
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0
};

const newsletterPopulationListForFindAll = [
  {
    path: 'featuredImage',
    select: mediumSelect
  },
  pageMetaPopulate
];

const newsletterPopulationListForFindOne = [
  ...newsletterPopulationListForFindAll
];

const getNewsletterForFrontEndFromDbNewsletter = (
  newsletter,
  language,
  isRequirePageMeta,
  defaultPageMeta
) => {
  return {
    label: cleanLabelForSendingToFrontEnd(newsletter.label),
    title: getEntityPropByLanguage(newsletter, 'title', language),
    message: getEntityPropByLanguage(newsletter, 'message', language),
    featuredImage: {
      src: newsletter.featuredImage && newsletter.featuredImage.url
    },
    pageMeta:
      isRequirePageMeta &&
      getPageMetaForFrontEnd(newsletter.pageMeta, language, defaultPageMeta)
  };
};

const getNewsletterList = async language => {
  // const newsletters = await Newsletter.find({
  //   isEnabled: {
  //     $ne: false
  //   }
  // })
  //   .select(newsletterSelectForFindAll)
  //   .populate(newsletterPopulationListForFindAll)
  //   .sort({
  //     createDT: 1
  //   });

  const newsletters = await getOrderingHandling(
    null,
    Newsletter,
    false,
    null,
    newsletterSelectForFindAll,
    null,
    newsletterPopulationListForFindAll,
    true
  );

  return getArraySafe(newsletters).map(newsletter =>
    getNewsletterForFrontEndFromDbNewsletter(newsletter, language)
  );
};

/* end of utilities */

// @route   GET api/frontend/newsletters/:lang/newsletters
// @desc    Get all newsletters
// @access  Public
router.get('/:lang/newsletters', [languageHandling], async (req, res) => {
  try {
    res.json(await getNewsletterList(req.language));
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/newsletters/:lang/newsletters/:label
// @desc    Get newsletter by label
// @access  Public
router.get(
  '/:lang/newsletters/:label',
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
        pageMetaMiscellaneous.newsListMeta,
        pageMetaMiscellaneous.landingPageMeta
      );

      const newsletter = await Newsletter.findOne({
        label: label
      })
        .select(newsletterSelectForFindOne)
        .populate(newsletterPopulationListForFindOne);

      if (!newsletter) {
        return res.status(404).json({
          errors: [newsletterResponseTypes.NEWSLETTER_NOT_EXISTS]
        });
      }

      const newsletterForFrontEnd = getNewsletterForFrontEndFromDbNewsletter(
        newsletter,
        language,
        true,
        defaultPageMeta
      );

      res.json(newsletterForFrontEnd);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports.router = router;

module.exports.getNewsletterList = getNewsletterList;
