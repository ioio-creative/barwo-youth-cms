const mongoose = require('mongoose');

const MiscellaneousInfoSchema = mongoose.Schema({
  termsAndConditionsTitle_tc: {
    type: String,
    require: true
  },
  termsAndConditionsTitle_sc: {
    type: String,
    require: true
  },
  termsAndConditionsTitle_en: {
    type: String,
    require: true
  },
  termsAndConditionsDesc_tc: {
    type: String,
    require: true
  },
  termsAndConditionsDesc_sc: {
    type: String,
    require: true
  },
  termsAndConditionsDesc_en: {
    type: String,
    require: true
  },

  privacyPolicyTitle_tc: {
    type: String,
    require: true
  },
  privacyPolicyTitle_sc: {
    type: String,
    require: true
  },
  privacyPolicyTitle_en: {
    type: String,
    require: true
  },
  privacyPolicyTitle_tc: {
    type: String,
    require: true
  },
  privacyPolicyTitle_sc: {
    type: String,
    require: true
  },
  privacyPolicyTitle_en: {
    type: String,
    require: true
  }
});

module.exports.MiscellaneousInfo = mongoose.model(
  'miscellaneousInfo',
  MiscellaneousInfoSchema
);
