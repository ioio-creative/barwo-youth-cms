const mongoose = require('mongoose');

const { PageMetaSchema } = require('./PageMeta');

const PageMetaMiscellaneousSchema = mongoose.Schema({
  landingPageMeta: PageMetaSchema,
  aboutMeta: PageMetaSchema,
  artistListMeta: PageMetaSchema,
  eventListMeta: PageMetaSchema,
  activityListMeta: PageMetaSchema,
  newsListMeta: PageMetaSchema,
  mediaListMeta: PageMetaSchema,

  lastModifyDT: {
    type: Date,
    default: Date.now
  },
  lastModifyUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

module.exports.PageMetaMiscellaneous = mongoose.model(
  'pageMetaMiscellaneous',
  PageMetaMiscellaneousSchema
);

module.exports.pageMetaMiscellaneousResponseTypes = {
  // input validation

  // db check
  PAGE_META_MISCELLANEOUS_NOT_EXISTS: 'PAGE_META_MISCELLANEOUS_NOT_EXISTS'
};
