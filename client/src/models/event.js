import { formatDateTimeString, formatDateString } from 'utils/datetime';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function Event() {
  this.label = '';
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';
  this.themeColor = '';
  this.artDirectors = [];
  this.shows = [];
  this.scenarists = [];
  this.descHeadline_tc = '';
  this.descHeadline_sc = '';
  this.descHeadline_en = '';
  this.desc_tc = '';
  this.desc_sc = '';
  this.desc_en = '';
  this.remarks_tc = '';
  this.remarks_sc = '';
  this.remarks_en = '';
  this.artists = [];
  /* ticketing */
  // this.venue_tc = '油麻地戲院';
  // this.venue_sc = '油麻地戏院';
  // this.venue_en = 'Yau Ma Tei Theatre';
  // this.prices = [
  //   { price_tc: '150元', price_sc: '150元', price_en: 'HK$150' },
  //   { price_tc: '100元', price_sc: '100元', price_en: 'HK$100' }
  // ];
  // this.priceRemarks_tc =
  //   '門票在各城市售票網售票處、網上、流動購票應用程式 My URBTIX（Android及iPhone/iPad版）及電話購票熱線發售<br>設有六十歲或以上高齡人士、殘疾人士及看護人、全日制學生及綜合社會保障援助受惠人士半價優惠 (全日制學生及綜援受惠人士優惠先到先得，額滿即止)';
  // this.priceRemarks_sc =
  //   '门票在各城市售票网售票处、网上、流动购票应用程式 My URBTIX（Android及iPhone/iPad版）及电话购票热线发售<br>设有六十岁或以上高龄人士、残疾人士及看护人、全日制学生及综合社会保障援助受惠人士半价优惠 (全日制学生及综援受惠人士优惠先到先得，额满即止)';
  // this.priceRemarks_en =
  //   'Tickets available at all URBTIX outlets, on Internet, by mobile ticketing app My URBTIX (Android and iPhone/iPad versions) and telephone.<br>Half price tickets available for senior citizens aged 60 or above, people with disabilities and the minder, full-time students and Comprehensive Social Security Assistance (CSSA) recipients (Limited tickets for full-time students and CSSA recipients available on a first-come-first-served basis).';
  // this.phones = [
  //   {
  //     label_tc: '節目查詢',
  //     label_sc: '节目查询',
  //     label_en: 'Programme enquiries',
  //     phone: '(852) 2384 2939'
  //   },
  //   {
  //     label_tc: '票務查詢',
  //     label_sc: '票务查询',
  //     label_en: 'Ticketing enquiries',
  //     phone: '(852) 3761 6661'
  //   },
  //   {
  //     label_tc: '信用卡電話熱線',
  //     label_sc: '信用卡电话热线',
  //     label_en: 'Credit card telephone booking',
  //     phone: '(852) 2111 5999'
  //   }
  // ];
  // this.ticketUrl = 'www.urbtix.hk';
  /* end of ticketing */
  this.themeColor = null;
  /* media */
  this.featuredImage = '';
  this.gallery = [];
  /* end of media */
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

Event.eventsResponseTypes = {
  // input validation
  LABEL_REQUIRED: {
    type: 'LABEL_REQUIRED',
    msg: 'LABEL_REQUIRED'
  },
  NAME_TC_REQUIRED: {
    type: 'NAME_TC_REQUIRED',
    msg: 'NAME_TC_REQUIRED'
  },
  NAME_SC_REQUIRED: {
    type: 'NAME_SC_REQUIRED',
    msg: 'NAME_SC_REQUIRED'
  },
  NAME_EN_REQUIRED: {
    type: 'NAME_EN_REQUIRED',
    msg: 'NAME_EN_REQUIRED'
  },
  EVENT_ART_DIRECTOR_REQUIRED: {
    type: 'EVENT_ART_DIRECTOR_REQUIRED',
    msg: 'One of the event art directors is missing.'
  },
  EVENT_ARTIST_ROLE_TC_REQUIRED: {
    type: 'EVENT_ARTIST_ROLE_TC_REQUIRED',
    msg: 'EVENT_ARTIST_ROLE_TC_REQUIRED'
  },
  EVENT_ARTIST_ROLE_SC_REQUIRED: {
    type: 'EVENT_ARTIST_ROLE_SC_REQUIRED',
    msg: 'EVENT_ARTIST_ROLE_SC_REQUIRED'
  },
  EVENT_ARTIST_ROLE_EN_REQUIRED: {
    type: 'EVENT_ARTIST_ROLE_EN_REQUIRED',
    msg: 'EVENT_ARTIST_ROLE_EN_REQUIRED'
  },
  EVENT_ARTIST_REQUIRED: {
    type: 'EVENT_ARTIST_REQUIRED',
    msg: 'One of the event artists is missing.'
  },
  EVENT_SHOW_DATE_REQUIRED: {
    type: 'EVENT_SHOW_DATE_REQUIRED',
    msg: 'One of the event show date is missing.'
  },
  EVENT_SHOW_START_TIME_REQUIRED: {
    type: 'EVENT_SHOW_START_TIME_REQUIRED',
    msg: 'One of the event show start time is missing.'
  },
  EVENT_SCENARIST_NAME_TC_REQUIRED: {
    type: 'EVENT_SCENARIST_NAME_TC_REQUIRED',
    msg: 'EVENT_SCENARIST_NAME_TC_REQUIRED'
  },
  EVENT_SCENARIST_NAME_SC_REQUIRED: {
    type: 'EVENT_SCENARIST_NAME_SC_REQUIRED',
    msg: 'EVENT_SCENARIST_NAME_SC_REQUIRED'
  },
  EVENT_SCENARIST_NAME_EN_REQUIRED: {
    type: 'EVENT_SCENARIST_NAME_EN_REQUIRED',
    msg: 'EVENT_SCENARIST_NAME_EN_REQUIRED'
  },
  // VENUE_TC_REQUIRED: { type: 'VENUE_TC_REQUIRED', msg: 'VENUE_TC_REQUIRED' },
  // VENUE_SC_REQUIRED: { type: 'VENUE_SC_REQUIRED', msg: 'VENUE_SC_REQUIRED' },
  // VENUE_EN_REQUIRED: { type: 'VENUE_EN_REQUIRED', msg: 'VENUE_EN_REQUIRED' },
  // EVENT_PHONE_LABEL_TC_REQUIRED: {
  //   type: 'EVENT_PHONE_LABEL_TC_REQUIRED',
  //   msg: 'EVENT_PHONE_LABEL_TC_REQUIRED'
  // },
  // EVENT_PHONE_LABEL_SC_REQUIRED: {
  //   type: 'EVENT_PHONE_LABEL_SC_REQUIRED',
  //   msg: 'EVENT_PHONE_LABEL_SC_REQUIRED'
  // },
  // EVENT_PHONE_LABEL_EN_REQUIRED: {
  //   type: 'EVENT_PHONE_LABEL_EN_REQUIRED',
  //   msg: 'EVENT_PHONE_LABEL_EN_REQUIRED'
  // },
  // EVENT_PHONE_PHONE_REQUIRED: {
  //   type: 'EVENT_PHONE_PHONE_REQUIRED',
  //   msg: 'EVENT_PHONE_PHONE_REQUIRED'
  // },
  // EVENT_PRICE_PRICE_TC_REQUIRED: {
  //   type: 'EVENT_PRICE_PRICE_TC_REQUIRED',
  //   msg: 'EVENT_PRICE_PRICE_TC_REQUIRED'
  // },
  // EVENT_PRICE_PRICE_SC_REQUIRED: {
  //   type: 'EVENT_PRICE_PRICE_SC_REQUIRED',
  //   msg: 'EVENT_PRICE_PRICE_SC_REQUIRED'
  // },
  // EVENT_PRICE_PRICE_EN_REQUIRED: {
  //   type: 'EVENT_PRICE_PRICE_EN_REQUIRED',
  //   msg: 'EVENT_PRICE_PRICE_EN_REQUIRED'
  // },

  // db check
  EVENT_NOT_EXISTS: {
    type: 'EVENT_NOT_EXISTS',
    msg: 'EVENT_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    msg: 'LABEL_ALREADY_EXISTS'
  },
  EVENT_USED_IN_PHASE: {
    type: 'EVENT_USED_IN_PHASE',
    msg: 'EVENT_USED_IN_PHASE'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

Event.getEventForDisplay = event => {
  return {
    ...event,
    createDTDisplay: formatDateTimeString(event.createDT),
    lastModifyDTDisplay: formatDateTimeString(event.lastModifyDT),
    lastModifyUserDisplay: event.lastModifyUser
      ? event.lastModifyUser.name
      : '',
    isEnabledDisplay: event.isEnabled.toString(),
    artDirectorsDisplay: firstOrDefault(event.artDirectors, { label: '' })
      .name_tc,
    artistsDisplay: firstOrDefault(event.artists, { artist: { label: '' } })
      .artist.name_tc,
    showsDisplay: formatDateString(
      firstOrDefault(event.shows, { date: null }).date
    ),
    scenaristsDisplay: firstOrDefault(event.scenarists, { name_tc: '' }).name_tc
    // pricesDisplay: firstOrDefault(event.prices, { price_tc: '' }).price_tc,
    // phonesDisplay: firstOrDefault(event.phones, { phone: '' }).phone
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
  'scenaristsDisplay'
  // 'pricesDisplay',
  // 'phonesDisplay'
];

Event.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default Event;
