import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function MiscellaneousInfo() {
  this.isShowLandingPopup = false;
  this.landingPopupMessage_tc = '';
  this.landingPopupMessage_sc = '';
  this.landingPopupMessage_en = '';

  this.termsAndConditionsTitle_tc = '';
  this.termsAndConditionsTitle_sc = '';
  this.termsAndConditionsTitle_en = '';

  this.termsAndConditionsDesc_tc = '';
  this.termsAndConditionsDesc_sc = '';
  this.termsAndConditionsDesc_en = '';

  this.privacyPolicyTitle_tc = '';
  this.privacyPolicyTitle_sc = '';
  this.privacyPolicyTitle_en = '';

  this.privacyPolicyDesc_tc = '';
  this.privacyPolicyDesc_sc = '';
  this.privacyPolicyDesc_en = '';

  this.contactAddress_tc = '';
  this.contactAddress_sc = '';
  this.contactAddress_en = '';

  this.contactTel = '';
  this.contactFax = '';
  this.contactEmail = '';

  this.footerOrganizerLogos = [];
  this.footerSponsorLogos = [];

  this.facebookLink = '';
  this.youtubeLink = '';
  this.instagramLink = '';
  //this.wechatLink = '';

  this.lastModifyDTDisplay = null;
  this.lastModifyUserDisplay = null;
}

/* statics */

MiscellaneousInfo.miscellaneousInfoResponseTypes = {
  // input validation
  TERMS_AND_CONDITIONS_TITLE_TC_REQUIRED: {
    type: 'TERMS_AND_CONDITIONS_TITLE_TC_REQUIRED',
    msg: 'TERMS_AND_CONDITIONS_TITLE_TC_REQUIRED'
  },
  TERMS_AND_CONDITIONS_TITLE_SC_REQUIRED: {
    type: 'TERMS_AND_CONDITIONS_TITLE_SC_REQUIRED',
    msg: 'TERMS_AND_CONDITIONS_TITLE_SC_REQUIRED'
  },
  TERMS_AND_CONDITIONS_TITLE_EN_REQUIRED: {
    type: 'TERMS_AND_CONDITIONS_TITLE_EN_REQUIRED',
    msg: 'TERMS_AND_CONDITIONS_TITLE_EN_REQUIRED'
  },

  TERMS_AND_CONDITIONS_DESC_TC_REQUIRED: {
    type: 'TERMS_AND_CONDITIONS_DESC_TC_REQUIRED',
    msg: 'TERMS_AND_CONDITIONS_DESC_TC_REQUIRED'
  },
  TERMS_AND_CONDITIONS_DESC_SC_REQUIRED: {
    type: 'TERMS_AND_CONDITIONS_DESC_SC_REQUIRED',
    msg: 'TERMS_AND_CONDITIONS_DESC_SC_REQUIRED'
  },
  TERMS_AND_CONDITIONS_DESC_EN_REQUIRED: {
    type: 'TERMS_AND_CONDITIONS_DESC_EN_REQUIRED',
    msg: 'TERMS_AND_CONDITIONS_DESC_EN_REQUIRED'
  },

  PRIVACY_POLICY_TITLE_TC_REQUIRED: {
    type: 'PRIVACY_POLICY_TITLE_TC_REQUIRED',
    msg: 'PRIVACY_POLICY_TITLE_TC_REQUIRED'
  },
  PRIVACY_POLICY_TITLE_SC_REQUIRED: {
    type: 'PRIVACY_POLICY_TITLE_SC_REQUIRED',
    msg: 'PRIVACY_POLICY_TITLE_SC_REQUIRED'
  },
  PRIVACY_POLICY_TITLE_EN_REQUIRED: {
    type: 'PRIVACY_POLICY_TITLE_EN_REQUIRED',
    msg: 'PRIVACY_POLICY_TITLE_EN_REQUIRED'
  },

  PRIVACY_POLICY_DESC_TC_REQUIRED: {
    type: 'PRIVACY_POLICY_DESC_TC_REQUIRED',
    msg: 'PRIVACY_POLICY_DESC_TC_REQUIRED'
  },
  PRIVACY_POLICY_DESC_SC_REQUIRED: {
    type: 'PRIVACY_POLICY_DESC_SC_REQUIRED',
    msg: 'PRIVACY_POLICY_DESC_SC_REQUIRED'
  },
  PRIVACY_POLICY_DESC_EN_REQUIRED: {
    type: 'PRIVACY_POLICY_DESC_EN_REQUIRED',
    msg: 'PRIVACY_POLICY_DESC_EN_REQUIRED'
  },

  CONTACT_ADDRESS_TC_REQUIRED: {
    type: 'CONTACT_ADDRESS_TC_REQUIRED',
    msg: 'CONTACT_ADDRESS_TC_REQUIRED'
  },
  CONTACT_ADDRESS_SC_REQUIRED: {
    type: 'CONTACT_ADDRESS_SC_REQUIRED',
    msg: 'CONTACT_ADDRESS_SC_REQUIRED'
  },
  CONTACT_ADDRESS_EN_REQUIRED: {
    type: 'CONTACT_ADDRESS_EN_REQUIRED',
    msg: 'CONTACT_ADDRESS_EN_REQUIRED'
  },

  CONTACT_TEL_REQUIRED: {
    type: 'CONTACT_TEL_REQUIRED',
    msg: 'CONTACT_TEL_REQUIRED'
  },
  CONTACT_FAX_REQUIRED: {
    type: 'CONTACT_FAX_REQUIRED',
    msg: 'CONTACT_FAX_REQUIRED'
  },
  CONTACT_EMAIL_REQUIRED: {
    type: 'CONTACT_EMAIL_REQUIRED',
    msg: 'CONTACT_EMAIL_REQUIRED'
  },

  // db check
  MISCELLANEOUS_INFO_NOT_EXISTS: {
    type: 'MISCELLANEOUS_INFO_NOT_EXISTS',
    msg: 'MISCELLANEOUS_INFO_NOT_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

MiscellaneousInfo.getMiscellaneousInfoForDisplay = miscellaneousInfo => {
  return {
    ...miscellaneousInfo,
    lastModifyDTDisplay: formatDateTimeString(miscellaneousInfo.lastModifyDT),
    lastModifyUserDisplay: miscellaneousInfo.lastModifyUser
      ? miscellaneousInfo.lastModifyUser.name
      : ''
  };
};

const displayFieldNames = ['lastModifyDTDisplay', 'lastModifyUserDisplay'];

MiscellaneousInfo.cleanSortByString = cleanSortByStringFuncGen(
  displayFieldNames
);

/* end of statics */

export default MiscellaneousInfo;
