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
  this.featuredImages = '';
  this.gallery = [];
  this.artists = [];
  this.venue_tc = [];
  this.venue_sc = [];
  this.venue_en = [];
  this.prices = [];
  this.priceRemarks_tc = '';
  this.priceRemarks_sc = '';
  this.priceRemarks_en = '';
  this.phones = [];
  this.ticketUrl = '';
  this.themeColor = null;
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
  VENUE_TC_REQUIRED: { type: 'VENUE_TC_REQUIRED', msg: 'VENUE_TC_REQUIRED' },
  VENUE_SC_REQUIRED: { type: 'VENUE_SC_REQUIRED', msg: 'VENUE_SC_REQUIRED' },
  VENUE_EN_REQUIRED: { type: 'VENUE_EN_REQUIRED', msg: 'VENUE_EN_REQUIRED' },
  EVENT_PHONE_LABEL_TC_REQUIRED: {
    type: 'EVENT_PHONE_LABEL_TC_REQUIRED',
    msg: 'EVENT_PHONE_LABEL_TC_REQUIRED'
  },
  EVENT_PHONE_LABEL_SC_REQUIRED: {
    type: 'EVENT_PHONE_LABEL_SC_REQUIRED',
    msg: 'EVENT_PHONE_LABEL_SC_REQUIRED'
  },
  EVENT_PHONE_LABEL_EN_REQUIRED: {
    type: 'EVENT_PHONE_LABEL_EN_REQUIRED',
    msg: 'EVENT_PHONE_LABEL_EN_REQUIRED'
  },
  EVENT_PHONE_PHONE_REQUIRED: {
    type: 'EVENT_PHONE_PHONE_REQUIRED',
    msg: 'EVENT_PHONE_PHONE_REQUIRED'
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
  EVENT_PRICE_PRICE_TC_REQUIRED: {
    type: 'EVENT_PRICE_PRICE_TC_REQUIRED',
    msg: 'EVENT_PRICE_PRICE_TC_REQUIRED'
  },
  EVENT_PRICE_PRICE_SC_REQUIRED: {
    type: 'EVENT_PRICE_PRICE_SC_REQUIRED',
    msg: 'EVENT_PRICE_PRICE_SC_REQUIRED'
  },
  EVENT_PRICE_PRICE_EN_REQUIRED: {
    type: 'EVENT_PRICE_PRICE_EN_REQUIRED',
    msg: 'EVENT_PRICE_PRICE_EN_REQUIRED'
  },

  // db check
  EVENT_NOT_EXISTS: {
    type: 'EVENT_NOT_EXISTS',
    msg: 'EVENT_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    msg: 'LABEL_ALREADY_EXISTS'
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
    scenaristsDisplay: firstOrDefault(event.scenarists, { name_tc: '' })
      .name_tc,
    pricesDisplay: firstOrDefault(event.prices, { price_tc: '' }).price_tc,
    phonesDisplay: firstOrDefault(event.phones, { phone: '' }).phone
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

Event.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default Event;
