const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const getOrderingHandling = require('../../../utils/ordering/getHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { mediumLinkTypes } = require('../../../types/mediumLink');
const { News } = require('../../../models/News');

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
    select: {
      url: 1
    }
  },
  {
    path: 'gallery',
    select: {
      url: 1
    }
  },
  {
    path: 'downloadMedium',
    select: {
      url: 1
    }
  }
];

const newsPopulationListForFindOne = [...newsPopulationListForFindAll];

const getNewsForFrontEndFromDbNews = (news, language) => {
  let download = '';
  switch (news.downloadType) {
    case mediumLinkTypes.URL:
      download = getEntityPropByLanguage(news, 'downloadUrl', language);
      break;
    case mediumLinkTypes.MEDIUM:
    default:
      download = news.downloadMedium && news.downloadMedium.url;
      break;
  }
  return {
    id: news._id,
    label: news.label,
    name: getEntityPropByLanguage(news, 'name', language),
    description: getEntityPropByLanguage(news, 'description', language),
    featuredImage: {
      src: news.featuredImage && news.featuredImage.url
    },
    download: download
  };
};

/* end of utilities */

// @route   GET api/frontend/newses/:lang/newses
// @desc    Get all newses
// @access  Public
router.get('/:lang/newses', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const newses = await getOrderingHandling(
      res,
      News,
      false,
      {},
      newsSelectForFindAll,
      {},
      newsPopulationListForFindAll
    );

    const newsesForFrontEnd = getArraySafe(newses).map(news => {
      return getNewsForFrontEndFromDbNews(news, language);
    });

    res.json(newsesForFrontEnd);
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

    const newsForFrontEnd = getNewsForFrontEndFromDbNews(news, language);

    res.json(newsForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
