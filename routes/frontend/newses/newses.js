const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const frontEndDetailPageApiLabelHandling = require('../../../middleware/frontEndDetailPageApiLabelHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const cleanLabelForSendingToFrontEnd = require('../../../utils/label/cleanLabelForSendingToFrontEnd');
//const { mediumLinkTypes } = require('../../../types/mediumLink');
const {
  getPageMetaForFrontEnd,
  getMixedPageMetas
} = require('../../../models/PageMeta');
const {
  News,
  newsTypesArray,
  newsResponseTypes
} = require('../../../models/News');
const mediumSelect = require('../common/mediumSelect');
const pageMetaPopulate = require('../common/pageMetaPopulate');
const {
  getPageMetaMiscellaneousFromDb
} = require('../pageMetaMiscellaneous/pageMetaMiscellaneous');

/* utilities */

const newsSelectForFindAll = {
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0
};

const newsSelectForFindOne = { ...newsSelectForFindAll };

const newsPopulationListForFindAll = [
  {
    path: 'featuredImage',
    select: mediumSelect
  }
];

const newsPopulationListForFindOne = [
  ...newsPopulationListForFindAll,
  // {
  //   path: 'downloadMedium',
  //   select: mediumSelect
  // },
  pageMetaPopulate
];

const getNewsForFrontEndFromDbNews = (
  news,
  language,
  isRequireDetail = false,
  defaultPageMeta = {}
) => {
  let detailData = {};

  if (isRequireDetail) {
    // let download = '';
    // switch (news.downloadType) {
    //   case mediumLinkTypes.URL:
    //     download = getEntityPropByLanguage(news, 'downloadUrl', language);
    //     break;
    //   case mediumLinkTypes.MEDIUM:
    //   default:
    //     download = news.downloadMedium && news.downloadMedium.url;
    //     break;
    // }

    detailData = {
      description: getEntityPropByLanguage(news, 'desc', language),
      //download: download,
      pageMeta: getPageMetaForFrontEnd(news.pageMeta, language, defaultPageMeta)
    };
  }

  return {
    id: news._id,
    label: cleanLabelForSendingToFrontEnd(news.label),
    name: getEntityPropByLanguage(news, 'name', language),
    featuredImage: {
      src: news.featuredImage && news.featuredImage.url
    },
    ...detailData
  };
};

const getNewsesInOrderFromDb = async newsType => {
  return await getOrderingHandling(
    null,
    News,
    false,
    {
      type: newsType
    },
    newsSelectForFindAll,
    {},
    newsPopulationListForFindAll,
    true
  );
};

const getNewsList = async req => {
  const language = req.language;

  const newsesByType = {};

  for (const type of newsTypesArray) {
    const newses = await getNewsesInOrderFromDb(type);

    newsesByType[type] = getArraySafe(newses).map(news => {
      return getNewsForFrontEndFromDbNews(news, language);
    });
  }

  return newsesByType;
};

/* end of utilities */

// @route   GET api/frontend/newses/:lang/newses
// @desc    Get all newses
// @access  Public
router.get('/:lang/newses', [languageHandling], async (req, res) => {
  try {
    res.json(await getNewsList(req));
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/newses/:lang/newses/:label
// @desc    Get news by label
// @access  Public
router.get(
  '/:lang/newses/:label',
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

      const news = await News.findOne({
        label: label
      })
        .select(newsSelectForFindOne)
        .populate(newsPopulationListForFindOne);

      if (!news) {
        return res
          .status(404)
          .json({ errors: [newsResponseTypes.NEWS_NOT_EXISTS] });
      }

      const newsForFrontEnd = getNewsForFrontEndFromDbNews(
        news,
        language,
        true,
        defaultPageMeta
      );

      res.json(newsForFrontEnd);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports.router = router;

module.exports.getNewsList = getNewsList;
