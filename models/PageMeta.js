const mongoose = require('mongoose');

const { getEntityPropByLanguage } = require('../globals/languages');

const PageMetaSchema = mongoose.Schema({
  title_tc: {
    type: String
  },
  title_sc: {
    type: String
  },
  title_en: {
    type: String
  },

  description_tc: {
    type: String
  },
  description_sc: {
    type: String
  },
  description_en: {
    type: String
  },

  /* open graph */

  ogSiteName_tc: {
    type: String
  },
  ogSiteName_sc: {
    type: String
  },
  ogSiteName_en: {
    type: String
  },

  ogTitle_tc: {
    type: String
  },
  ogTitle_sc: {
    type: String
  },
  ogTitle_en: {
    type: String
  },

  ogDescription_tc: {
    type: String
  },
  ogDescription_sc: {
    type: String
  },
  ogDescription_en: {
    type: String
  },

  ogImage: { type: mongoose.Schema.Types.ObjectId, ref: 'medium' },

  ogImageAlt_tc: {
    type: String
  },
  ogImageAlt_sc: {
    type: String
  },
  ogImageAlt_en: {
    type: String
  },

  /* end of open graph */

  facebookAppId: {
    type: String
  }
});

module.exports.PageMeta = mongoose.model('pageMeta', PageMetaSchema);

module.exports.PageMetaSchema = PageMetaSchema;

const pageMetaFieldNames = [
  'title_tc',
  'title_sc',
  'title_en',

  'description_tc',
  'description_sc',
  'description_en',

  /* open graph */

  'ogSiteName_tc',
  'ogSiteName_sc',
  'ogSiteName_en',

  'ogTitle_tc',
  'ogTitle_sc',
  'ogTitle_en',

  'ogDescription_tc',
  'ogDescription_sc',
  'ogDescription_en',

  'ogImage',

  'ogImageAlt_tc',
  'ogImageAlt_sc',
  'ogImageAlt_en',

  /* end of open graph */

  'facebookAppId'
];

const getMixedPageMetas = (pageMetaMajor, pageMetaBackup) => {
  const mixedPageMeta = {};
  for (const fieldName of pageMetaFieldNames) {
    mixedPageMeta[fieldName] =
      (pageMetaMajor && pageMetaMajor[fieldName]) ||
      (pageMetaBackup ? pageMetaBackup[fieldName] : null);
  }
  return mixedPageMeta;
};

module.exports.getMixedPageMetas = getMixedPageMetas;

module.exports.getPageMetaForFrontEnd = (
  pageMeta,
  language,
  defaultPageMeta = null
) => {
  const mixedPageMeta = getMixedPageMetas(pageMeta, defaultPageMeta);
  return {
    title: getEntityPropByLanguage(mixedPageMeta, 'title', language),
    description: getEntityPropByLanguage(
      mixedPageMeta,
      'description',
      language
    ),
    ogSiteName: getEntityPropByLanguage(mixedPageMeta, 'ogSiteName', language),
    ogTitle: getEntityPropByLanguage(mixedPageMeta, 'title', language),
    ogDescription: getEntityPropByLanguage(
      mixedPageMeta,
      'ogDescription',
      language
    ),
    ogImage: {
      src: mixedPageMeta.ogImage && mixedPageMeta.ogImage.url
    },
    ogImageAlt: getEntityPropByLanguage(mixedPageMeta, 'ogImageAlt', language),
    // TODO:
    // ogImageWidth: 1200,
    // ogImageHeight: 630,
    facebookAppId: defaultPageMeta
      ? defaultPageMeta.facebookAppId
      : pageMeta.facebookAppId
  };
};
