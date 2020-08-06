const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
//const { mediumLinkTypes } = require('../../../types/mediumLink');
const {
  News,
  newsTypesArray,
  newsResponseTypes
} = require('../../../models/News');
const mediumSelect = require('../common/mediumSelect');

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
  },
  {
    path: 'gallery',
    select: mediumSelect
  }
  // {
  //   path: 'downloadMedium',
  //   select: mediumSelect
  // }
];

const newsPopulationListForFindOne = [...newsPopulationListForFindAll];

const getNewsForFrontEndFromDbNews = (news, language) => {
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
  return {
    id: news._id,
    label: news.label,
    name: getEntityPropByLanguage(news, 'name', language),
    description: getEntityPropByLanguage(news, 'desc', language),
    featuredImage: {
      src: news.featuredImage && news.featuredImage.url
    }
    //download: download
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

const getNewsList = async language => {
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
    res.json(await getNewsList(req.language));
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/newses/:lang/newses/:label
// @desc    Get news by label
// @access  Public
router.get('/:lang/newses/:label', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const news = await News.findOne({
      label: req.params.label
    })
      .select(newsSelectForFindOne)
      .populate(newsPopulationListForFindOne);

    if (!news) {
      return res
        .status(404)
        .json({ errors: [newsResponseTypes.NEWS_NOT_EXISTS] });
    }

    const newsForFrontEnd = getNewsForFrontEndFromDbNews(news, language);

    res.json(newsForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports.router = router;

module.exports.getNewsList = getNewsList;
