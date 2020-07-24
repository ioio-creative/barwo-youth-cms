const mongoose = require('mongoose');

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
