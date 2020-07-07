import { formatDateTimeString, formatDateString } from 'utils/datetime';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function TicketingDefault() {
  /* ticketing */
  this.venue_tc = '油麻地戲院';
  this.venue_sc = '油麻地戏院';
  this.venue_en = 'Yau Ma Tei Theatre';
  this.prices = [];
  this.priceRemarks_tc =
    '門票在各城市售票網售票處、網上、流動購票應用程式 My URBTIX（Android及iPhone/iPad版）及電話購票熱線發售<br>設有六十歲或以上高齡人士、殘疾人士及看護人、全日制學生及綜合社會保障援助受惠人士半價優惠 (全日制學生及綜援受惠人士優惠先到先得，額滿即止)';
  this.priceRemarks_sc =
    '门票在各城市售票网售票处、网上、流动购票应用程式 My URBTIX（Android及iPhone/iPad版）及电话购票热线发售<br>设有六十岁或以上高龄人士、残疾人士及看护人、全日制学生及综合社会保障援助受惠人士半价优惠 (全日制学生及综援受惠人士优惠先到先得，额满即止)';
  this.priceRemarks_en =
    'Tickets available at all URBTIX outlets, on Internet, by mobile ticketing app My URBTIX (Android and iPhone/iPad versions) and telephone.<br>Half price tickets available for senior citizens aged 60 or above, people with disabilities and the minder, full-time students and Comprehensive Social Security Assistance (CSSA) recipients (Limited tickets for full-time students and CSSA recipients available on a first-come-first-served basis).';
  this.phones = [];
  this.ticketUrl = 'www.urbtix.hk';
  /* end of ticketing */
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

TicketingDefault.ticketingDefaultResponseTypes = {
  // input validation
  VENUE_TC_REQUIRED: { type: 'VENUE_TC_REQUIRED', msg: 'VENUE_TC_REQUIRED' },
  VENUE_SC_REQUIRED: { type: 'VENUE_SC_REQUIRED', msg: 'VENUE_SC_REQUIRED' },
  VENUE_EN_REQUIRED: { type: 'VENUE_EN_REQUIRED', msg: 'VENUE_EN_REQUIRED' },
  TICKETING_DEFAULT_PHONE_LABEL_TC_REQUIRED: {
    type: 'TICKETING_DEFAULT_PHONE_LABEL_TC_REQUIRED',
    msg: 'TICKETING_DEFAULT_PHONE_LABEL_TC_REQUIRED'
  },
  TICKETING_DEFAULT_PHONE_LABEL_SC_REQUIRED: {
    type: 'TICKETING_DEFAULT_PHONE_LABEL_SC_REQUIRED',
    msg: 'TICKETING_DEFAULT_PHONE_LABEL_SC_REQUIRED'
  },
  TICKETING_DEFAULT_PHONE_LABEL_EN_REQUIRED: {
    type: 'TICKETING_DEFAULT_PHONE_LABEL_EN_REQUIRED',
    msg: 'TICKETING_DEFAULT_PHONE_LABEL_EN_REQUIRED'
  },
  TICKETING_DEFAULT_PHONE_PHONE_REQUIRED: {
    type: 'TICKETING_DEFAULT_PHONE_PHONE_REQUIRED',
    msg: 'TICKETING_DEFAULT_PHONE_PHONE_REQUIRED'
  },
  TICKETING_DEFAULT_SCENARIST_NAME_TC_REQUIRED: {
    type: 'TICKETING_DEFAULT_SCENARIST_NAME_TC_REQUIRED',
    msg: 'TICKETING_DEFAULT_SCENARIST_NAME_TC_REQUIRED'
  },
  TICKETING_DEFAULT_SCENARIST_NAME_SC_REQUIRED: {
    type: 'TICKETING_DEFAULT_SCENARIST_NAME_SC_REQUIRED',
    msg: 'TICKETING_DEFAULT_SCENARIST_NAME_SC_REQUIRED'
  },
  TICKETING_DEFAULT_SCENARIST_NAME_EN_REQUIRED: {
    type: 'TICKETING_DEFAULT_SCENARIST_NAME_EN_REQUIRED',
    msg: 'TICKETING_DEFAULT_SCENARIST_NAME_EN_REQUIRED'
  },
  TICKETING_DEFAULT_PRICE_PRICE_TC_REQUIRED: {
    type: 'TICKETING_DEFAULT_PRICE_PRICE_TC_REQUIRED',
    msg: 'TICKETING_DEFAULT_PRICE_PRICE_TC_REQUIRED'
  },
  TICKETING_DEFAULT_PRICE_PRICE_SC_REQUIRED: {
    type: 'TICKETING_DEFAULT_PRICE_PRICE_SC_REQUIRED',
    msg: 'TICKETING_DEFAULT_PRICE_PRICE_SC_REQUIRED'
  },
  TICKETING_DEFAULT_PRICE_PRICE_EN_REQUIRED: {
    type: 'TICKETING_DEFAULT_PRICE_PRICE_EN_REQUIRED',
    msg: 'TICKETING_DEFAULT_PRICE_PRICE_EN_REQUIRED'
  },

  // db check
  TICKETING_DEFAULT_NOT_EXISTS: {
    type: 'TICKETING_DEFAULT_NOT_EXISTS',
    msg: 'TICKETING_DEFAULT_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    msg: 'LABEL_ALREADY_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

TicketingDefault.getTicketingDefaultForDisplay = ticketingDefault => {
  return {
    ...ticketingDefault,
    createDTDisplay: formatDateTimeString(ticketingDefault.createDT),
    lastModifyDTDisplay: formatDateTimeString(ticketingDefault.lastModifyDT),
    lastModifyUserDisplay: ticketingDefault.lastModifyUser
      ? ticketingDefault.lastModifyUser.name
      : '',
    isEnabledDisplay: ticketingDefault.isEnabled.toString(),
    pricesDisplay: firstOrDefault(ticketingDefault.prices, { price_tc: '' })
      .price_tc,
    phonesDisplay: firstOrDefault(ticketingDefault.phones, { phone: '' }).phone
  };
};

const displayFieldNames = [
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay',
  'artDirectorsDisplay',
  'artistsDisplay',
  'showsDisplay',
  'scenaristsDisplay',
  'pricesDisplay',
  'phonesDisplay'
];

TicketingDefault.cleanSortByString = cleanSortByStringFuncGen(
  displayFieldNames
);

/* end of statics */

export default TicketingDefault;
