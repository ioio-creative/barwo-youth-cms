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
  privacyPolicyDesc_tc: {
    type: String,
    require: true
  },
  privacyPolicyDesc_sc: {
    type: String,
    require: true
  },
  privacyPolicyDesc_en: {
    type: String,
    require: true
  },

  footerOrganizerLogos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'medium'
    }
  ],
  footerSponsorLogos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'medium'
    }
  ],

  lastModifyDT: {
    type: Date,
    default: Date.now
  },
  lastModifyUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

module.exports.MiscellaneousInfo = mongoose.model(
  'miscellaneousInfo',
  MiscellaneousInfoSchema
);

module.exports.miscellaneousInfoResponseTypes = {
  // input validation
  TERMS_AND_CONDITIONS_TITLE_TC_REQUIRED:
    'TERMS_AND_CONDITIONS_TITLE_TC_REQUIRED',
  TERMS_AND_CONDITIONS_TITLE_SC_REQUIRED:
    'TERMS_AND_CONDITIONS_TITLE_SC_REQUIRED',
  TERMS_AND_CONDITIONS_TITLE_EN_REQUIRED:
    'TERMS_AND_CONDITIONS_TITLE_EN_REQUIRED',

  TERMS_AND_CONDITIONS_DESC_TC_REQUIRED:
    'TERMS_AND_CONDITIONS_DESC_TC_REQUIRED',
  TERMS_AND_CONDITIONS_DESC_SC_REQUIRED:
    'TERMS_AND_CONDITIONS_DESC_SC_REQUIRED',
  TERMS_AND_CONDITIONS_DESC_EN_REQUIRED:
    'TERMS_AND_CONDITIONS_DESC_EN_REQUIRED',

  PRIVACY_POLICY_TITLE_TC_REQUIRED: 'PRIVACY_POLICY_TITLE_TC_REQUIRED',
  PRIVACY_POLICY_TITLE_SC_REQUIRED: 'PRIVACY_POLICY_TITLE_SC_REQUIRED',
  PRIVACY_POLICY_TITLE_EN_REQUIRED: 'PRIVACY_POLICY_TITLE_EN_REQUIRED',

  PRIVACY_POLICY_DESC_TC_REQUIRED: 'PRIVACY_POLICY_DESC_TC_REQUIRED',
  PRIVACY_POLICY_DESC_SC_REQUIRED: 'PRIVACY_POLICY_DESC_SC_REQUIRED',
  PRIVACY_POLICY_DESC_EN_REQUIRED: 'PRIVACY_POLICY_DESC_EN_REQUIRED',

  // db check
  MISCELLANEOUS_INFO_NOT_EXISTS: 'MISCELLANEOUS_INFO_NOT_EXISTS'
};
