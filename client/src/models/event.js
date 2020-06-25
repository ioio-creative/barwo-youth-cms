import { formatDateTimeString, formatDateString } from 'utils/datetime';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function Event() {
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';
  this.desc_tc = '';
  this.desc_sc = '';
  this.desc_en = '';
  this.remarks_tc = '';
  this.remarks_sc = '';
  this.remarks_en = '';
  this.writer_tc = '';
  this.writer_sc = '';
  this.writer_en = '';
  this.artDirectors = [];
  this.artists = [];
  this.shows = [];
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

Event.eventsResponseTypes = {
  // input validation
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

  // db check
  EVENT_NOT_EXISTS: {
    type: 'EVENT_NOT_EXISTS',
    msg: 'EVENT_NOT_EXISTS'
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
    artDirectorsDisplay: firstOrDefault(event.artDirectors, { name_tc: '' })
      .name_tc,
    artistsDisplay: firstOrDefault(event.artists, { artist: { name_tc: '' } })
      .artist.name_tc,
    showsDisplay: formatDateString(
      firstOrDefault(event.shows, { date: null }).date
    )
  };
};

const displayFieldNames = [
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

Event.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default Event;
