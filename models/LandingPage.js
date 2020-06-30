const mongoose = require('mongoose');

const LandingPageSchema = mongoose.Schema({
  featuredVideo: { type: mongoose.Schema.Types.ObjectId, ref: 'medium' },
  featuredVideo2: { type: mongoose.Schema.Types.ObjectId, ref: 'medium' },
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

  // db check
  LANDING_PAGE_NOT_EXISTS: 'LANDING_PAGE_NOT_EXISTS'
};
