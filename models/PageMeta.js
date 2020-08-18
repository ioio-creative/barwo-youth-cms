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

module.exports.getPageMetaForFrontEnd = (
  pageMeta,
  language,
  defaultPageMeta = null
) => {
  if (!pageMeta) {
    return {};
  }
  return {
    title: getEntityPropByLanguage(pageMeta, 'title', language),
    description: getEntityPropByLanguage(pageMeta, 'description', language),
    ogSiteName: getEntityPropByLanguage(pageMeta, 'ogSiteName', language),
    ogTitle: getEntityPropByLanguage(pageMeta, 'title', language),
    ogDescription: getEntityPropByLanguage(pageMeta, 'ogDescription', language),
    ogImage: {
      src: pageMeta.ogImage && pageMeta.ogImage.url
    },
    ogImageAlt: getEntityPropByLanguage(pageMeta, 'ogImageAlt', language),
    // TODO:
    // ogImageWidth: 1200,
    // ogImageHeight: 630,
    facebookAppId: defaultPageMeta
      ? defaultPageMeta.facebookAppId
      : pageMeta.facebookAppId
  };
};

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

  'ogImageAlt_tc',
  'ogImageAlt_sc',
  'ogImageAlt_en',

  /* end of open graph */

  'facebookAppId'
];

module.exports.getMixedPageMetas = (pageMetaMajor, pageMetaBackup) => {
  const mixedPageMeta = {};
  for (const fieldName of pageMetaFieldNames) {
    mixedPageMeta[fieldName] =
      pageMetaMajor[fieldName] || pageMetaBackup[fieldName];
  }
  return mixedPageMeta;
};
