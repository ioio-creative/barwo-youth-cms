const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { formatDateStringForFrontEnd } = require('../../../utils/datetime');
const distinct = require('../../../utils/js/array/distinct');
const { NewsMediaItem } = require('../../../models/NewsMediaItem');
const mediumSelect = require('../common/mediumSelect');

const newsMediaItemSelectForFindAll = {
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0
};

const newsMediaItemSelectForFindOne = {
  ...newsMediaItemSelectForFindAll
};

const newsMediaItemPopulationListForFindAll = [
  {
    path: 'gallery',
    select: mediumSelect
  }
];

const newsMediaItemPopulationListForFindOne = [
  ...newsMediaItemPopulationListForFindAll
];

const getNewsMediaItemForFrontEndFromDbNewsMediaItem = (
  newsMediaItem,
  language
) => {
  return {
    label: newsMediaItem.label,
    name: getEntityPropByLanguage(newsMediaItem, 'name', language),
    fromDate: formatDateStringForFrontEnd(newsMediaItem.fromDate),
    description: getEntityPropByLanguage(newsMediaItem, 'desc', language),
    gallery: getArraySafe(newsMediaItem.gallery).map(medium => {
      return {
        src: medium && medium.url
      };
    })
  };
};

/* end of utilities */

// @route   GET api/frontend/newsMediaItems/:lang/newsMediaItems
// @desc    Get all news media items
// @access  Public
router.get('/:lang/newsMediaItems', [languageHandling], async (req, res) => {
  try {
    const language = req.language;

    const newsMediaItems = await NewsMediaItem.find({
      isEnabled: {
        $ne: false
      }
    })
      .select(newsMediaItemSelectForFindAll)
      .populate(newsMediaItemPopulationListForFindAll)
      .sort({
        // sort in ascending order here
        // coz within a year, the items should be ascending according to fromDate
        fromDate: 1
      });

    const safeNewsMediaItems = getArraySafe(newsMediaItems).map(
      newsMediaItem => {
        // !!!Important!!! somehow destructuring gives extended object with lots of unrelated fields...
        // return {
        //   ...newsMediaItem,
        //   year: newsMediaItem.fromDate.getFullYear()
        // }
        newsMediaItem.year = newsMediaItem.fromDate.getFullYear();
        return newsMediaItem;
      }
    );

    const years = distinct(
      safeNewsMediaItems.map(newsMediaItem => newsMediaItem.year)
    ); //.sort();

    const yearsForFrontEnd = [];

    // descending year here
    for (let i = years.length - 1; i >= 0; i--) {
      const year = years[i];
      const newsMediaItemsOfYear = safeNewsMediaItems
        .filter(newsMediaItem => newsMediaItem.year === year)
        .map(newsMediaItem => {
          return getNewsMediaItemForFrontEndFromDbNewsMediaItem(
            newsMediaItem,
            language
          );
        });

      yearsForFrontEnd.push({
        year: year,
        newsMediaItems: newsMediaItemsOfYear
      });
    }

    res.json(yearsForFrontEnd);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/newsMediaItems/:lang/newsMediaItems/:label
// @desc    Get news media item by label
// @access  Public
router.get(
  '/:lang/newsMediaItems/:label',
  [languageHandling],
  async (req, res) => {
    try {
      const language = req.language;

      const newsMediaItem = await NewsMediaItem.findOne({
        label: req.params.label
      })
        .select(newsMediaItemSelectForFindOne)
        .populate(newsMediaItemPopulationListForFindOne);

      const newsMediaItemForFrontEnd = getNewsMediaItemForFrontEndFromDbNewsMediaItem(
        newsMediaItem,
        language
      );

      res.json(newsMediaItemForFrontEnd);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
