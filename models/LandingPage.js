const mongoose = require('mongoose');

const { PageMetaSchema } = require('./PageMeta');

const LandingPageSchema = mongoose.Schema({
  landingVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'medium' }],
  featuredVideo1: { type: mongoose.Schema.Types.ObjectId, ref: 'medium' },
  //featuredVideo2: { type: mongoose.Schema.Types.ObjectId, ref: 'medium' },
  //featuredArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'artist' }],
  featuredActivities: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'activity' }
  ],
  pageMeta: PageMetaSchema,
  lastModifyDT: {
    type: Date,
    default: Date.now
  },
  lastModifyUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

module.exports.LandingPage = mongoose.model('landingPage', LandingPageSchema);

module.exports.landingPageResponseTypes = {
  // input validation
  //LANDING_PAGE_ARTIST_REQUIRED: 'LANDING_PAGE_ARTIST_REQUIRED',
  LANDING_PAGE_ACTIVITY_REQUIRED: 'LANDING_PAGE_ACTIVITY_REQUIRED',

  // db check
  LANDING_PAGE_NOT_EXISTS: 'LANDING_PAGE_NOT_EXISTS'
};
