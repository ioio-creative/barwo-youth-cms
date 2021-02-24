const mongoose = require('mongoose');

const MiscellaneousInfoSchema = mongoose.Schema({
  isShowLandingPopup: {
    type: Boolean,
    default: false
  },
  landingPopupMessage_tc: {
    type: String
  },
  landingPopupMessage_sc: {
    type: String
  },
  landingPopupMessage_en: {
    type: String
  },

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

  recruitmentTitle_tc: {
    type: String,
    require: true
  },
  recruitmentTitle_sc: {
    type: String,
    require: true
  },
  recruitmentTitle_en: {
    type: String,
    require: true
  },
  recruitmentDesc_tc: {
    type: String,
    require: true
  },
  recruitmentDesc_sc: {
    type: String,
    require: true
  },
  recruitmentDesc_en: {
    type: String,
    require: true
  },

  contactAddress_tc: {
    type: String,
    require: true
  },
  contactAddress_sc: {
    type: String,
    require: true
  },
  contactAddress_en: {
    type: String,
    require: true
  },
  contactTel: {
    type: String,
    require: true
  },
  contactFax: {
    type: String,
    require: true
  },
  contactEmail: {
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

  facebookLink: {
    type: String
  },
  youtubeLink: {
    type: String
  },
  instagramLink: {
    type: String
  },
  // wechatLink: {
  //   type: String
  // },

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

  CONTACT_ADDRESS_TC_REQUIRED: 'CONTACT_ADDRESS_TC_REQUIRED',
  CONTACT_ADDRESS_SC_REQUIRED: 'CONTACT_ADDRESS_SC_REQUIRED',
  CONTACT_ADDRESS_EN_REQUIRED: 'CONTACT_ADDRESS_EN_REQUIRED',

  CONTACT_TEL_REQUIRED: 'CONTACT_TEL_REQUIRED',
  CONTACT_FAX_REQUIRED: 'CONTACT_FAX_REQUIRED',
  CONTACT_EMAIL_REQUIRED: 'CONTACT_EMAIL_REQUIRED',

  // db check
  MISCELLANEOUS_INFO_NOT_EXISTS: 'MISCELLANEOUS_INFO_NOT_EXISTS'
};
