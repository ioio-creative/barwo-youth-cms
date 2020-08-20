const express = require('express');
const router = express.Router();

const { getEntityPropByLanguage } = require('../../../globals/languages');
const languageHandling = require('../../../middleware/languageHandling');
const frontEndDetailPageApiLabelHandling = require('../../../middleware/frontEndDetailPageApiLabelHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const cleanLabelForSendingToFrontEnd = require('../../../utils/label/cleanLabelForSendingToFrontEnd');
const { formatDateStringForFrontEnd } = require('../../../utils/datetime');
const distinct = require('../../../utils/js/array/distinct');
const {
  getPageMetaForFrontEnd,
  getMixedPageMetas
} = require('../../../models/PageMeta');
const {
  NewsMediaItem,
  newsMediaItemResponseTypes
} = require('../../../models/NewsMediaItem');
const mediumSelect = require('../common/mediumSelect');
const pageMetaPopulate = require('../common/pageMetaPopulate');
const {
  getPageMetaMiscellaneousFromDb
} = require('../pageMetaMiscellaneous/pageMetaMiscellaneous');

const newsMediaItemSelectForFindAll = {
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0,

  desc_tc: 0,
  desc_sc: 0,
  desc_en: 0
};

// The following would cause this error:
// MongoDB: Can't canonicalize query: BadValue Projection cannot have a mix of inclusion and exclusion
// https://stackoverflow.com/questions/24949544/mongodb-cant-canonicalize-query-badvalue-projection-cannot-have-a-mix-of-incl
// const newsMediaItemSelectForFindOne = {
//   ...newsMediaItemSelectForFindAll,

//   desc_tc: 1,
//   desc_sc: 1,
//   desc_en: 1
// };

const newsMediaItemSelectForFindOne = {
  isEnabled: 0,
  createDT: 0,
  lastModifyDT: 0,
  lastModifyUser: 0
};

const newsMediaItemPopulationListForFindAll = [
  {
    path: 'thumbnail',
    select: mediumSelect
  },
  {
    path: 'gallery',
    select: mediumSelect
  },
  pageMetaPopulate
];

const newsMediaItemPopulationListForFindOne = [
  ...newsMediaItemPopulationListForFindAll
];

const getNewsMediaItemForFrontEndFromDbNewsMediaItem = (
  newsMediaItem,
  language,
  isRequirePageMeta,
  defaultPageMeta
) => {
  return {
    label: cleanLabelForSendingToFrontEnd(newsMediaItem.label),
    name: getEntityPropByLanguage(newsMediaItem, 'name', language),
    fromDate: formatDateStringForFrontEnd(newsMediaItem.fromDate),
    description: getEntityPropByLanguage(newsMediaItem, 'desc', language),
    thumbnail: {
      src: newsMediaItem.thumbnail && newsMediaItem.thumbnail.url
    },
    gallery: getArraySafe(newsMediaItem.gallery).map(medium => {
      return {
        src: medium && medium.url
      };
    }),
    videoLinks: getArraySafe(newsMediaItem.videoLinks),
    pageMeta:
      isRequirePageMeta &&
      getPageMetaForFrontEnd(newsMediaItem.pageMeta, language, defaultPageMeta)
  };
};

const getNewsMediaItemList = async language => {
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

  const safeNewsMediaItems = getArraySafe(newsMediaItems).map(newsMediaItem => {
    // !!!Important!!! somehow destructuring gives extended object with lots of unrelated fields...
    // return {
    //   ...newsMediaItem,
    //   year: newsMediaItem.fromDate.getUTCFullYear()
    // }
    newsMediaItem.year = newsMediaItem.fromDate.getUTCFullYear();
    return newsMediaItem;
  });

  const years = distinct(
    safeNewsMediaItems.map(newsMediaItem => newsMediaItem.year)
  ); //.sort();

  const newsMediaItemsByYear = [];

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

    newsMediaItemsByYear.push({
      year: year,
      newsMediaItems: newsMediaItemsOfYear
    });
  }

  return newsMediaItemsByYear;
};

/* end of utilities */

// @route   GET api/frontend/newsMediaItems/:lang/newsMediaItems
// @desc    Get all news media items
// @access  Public
router.get('/:lang/newsMediaItems', [languageHandling], async (req, res) => {
  try {
    res.json(await getNewsMediaItemList(req.language));
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/frontend/newsMediaItems/:lang/newsMediaItems/:label
// @desc    Get news media item by label
// @access  Public
router.get(
  '/:lang/newsMediaItems/:label',
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

      const newsMediaItem = await NewsMediaItem.findOne({
        label: label
      })
        .select(newsMediaItemSelectForFindOne)
        .populate(newsMediaItemPopulationListForFindOne);

      if (!newsMediaItem) {
        return res.status(404).json({
          errors: [newsMediaItemResponseTypes.NEWS_MEDIA_ITEM_NOT_EXISTS]
        });
      }

      const newsMediaItemForFrontEnd = getNewsMediaItemForFrontEndFromDbNewsMediaItem(
        newsMediaItem,
        language,
        true,
        defaultPageMeta
      );

      res.json(newsMediaItemForFrontEnd);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports.router = router;

module.exports.getNewsMediaItemList = getNewsMediaItemList;
