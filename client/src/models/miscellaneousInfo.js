import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function MiscellaneousInfo() {
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

  this.footerOrganizerLogos = [];
  this.footerSponsorLogos = [];

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

  // db check
  MISCELLANEOUS_INFO_NOT_EXISTS: 'MISCELLANEOUS_INFO_NOT_EXISTS',

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

MiscellaneousInfo.getMiscellaneousInfoForDisplay = miscellaneousInfo => {
  return {
    ...miscellaneousInfo,
    lastModifyDTDisplay: formatDateTimeString(about.lastModifyDT),
    lastModifyUserDisplay: about.lastModifyUser ? about.lastModifyUser.name : ''
  };
};

const displayFieldNames = ['lastModifyDTDisplay', 'lastModifyUserDisplay'];

MiscellaneousInfo.cleanSortByString = cleanSortByStringFuncGen(
  displayFieldNames
);

/* end of statics */

export default MiscellaneousInfo;
