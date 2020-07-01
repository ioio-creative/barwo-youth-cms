const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const EventArtistSchema = mongoose.Schema({
  role_tc: {
    type: String,
    require: true
  },
  role_sc: {
    type: String,
    require: true
  },
  role_en: {
    type: String,
    require: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'artist'
  }
});

const EventShowSchema = mongoose.Schema({
  date: {
    type: Date,
    require: true
  },
  startTime: {
    type: String,
    require: true
  }
});

const EventTicketPhoneSchema = mongoose.Schema({
  label_tc: {
    type: String,
    require: true
  },
  label_sc: {
    type: String,
    require: true
  },
  label_en: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  }
});

const EventSchema = mongoose.Schema({
  label: {
    type: String,
    require: true,
    unique: true
  },
  name_tc: {
    type: String,
    require: true
  },
  name_sc: {
    type: String,
    require: true
  },
  name_en: {
    type: String,
    require: true
  },
  shows: [EventShowSchema],
  writer_tc: {
    type: String
  },
  writer_sc: {
    type: String
  },
  writer_en: {
    type: String
  },
  desc_tc: {
    type: String
  },
  desc_sc: {
    type: String
  },
  desc_en: {
    type: String
  },
  remarks_tc: {
    type: String
  },
  remarks_sc: {
    type: String
  },
  remarks_en: {
    type: String
  },
  featuredImages: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  gallery: {
    type: [mongoose.Schema.Types.ObjectId]
  },
  artDirectors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'artist' }],
  artists: [EventArtistSchema],
  /* ticketing */
  venue_tc: {
    type: String,
    require: true
  },
  venue_sc: {
    type: String,
    require: true
  },
  venue_en: {
    type: String,
    require: true
  },
  // prices: [Number],
  priceRemarks_tc: {
    type: String
  },
  priceRemarks_sc: {
    type: String
  },
  priceRemarks_en: {
    type: String
  },
  // phones: [EventTicketPhoneSchema],
  ticketUrl: {
    type: String
  },
  /* end of ticketing */
  phasesInvolved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'phase' }],
  themeColour: {
    type: String
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  createDT: {
    type: Date,
    default: Date.now
  },
  lastModifyDT: {
    type: Date,
    default: Date.now
  },
  lastModifyUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

EventSchema.plugin(mongoosePaginate);

module.exports.Event = mongoose.model('event', EventSchema);

module.exports.eventResponseTypes = {
  // input validation
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',
  EVENT_ART_DIRECTOR_REQUIRED: 'EVENT_ART_DIRECTOR_REQUIRED',
  EVENT_ARTIST_ROLE_TC_REQUIRED: 'EVENT_ARTIST_ROLE_TC_REQUIRED',
  EVENT_ARTIST_ROLE_SC_REQUIRED: 'EVENT_ARTIST_ROLE_SC_REQUIRED',
  EVENT_ARTIST_ROLE_EN_REQUIRED: 'EVENT_ARTIST_ROLE_EN_REQUIRED',
  EVENT_ARTIST_REQUIRED: 'EVENT_ARTIST_REQUIRED',
  EVENT_SHOW_DATE_REQUIRED: 'EVENT_SHOW_DATE_REQUIRED',
  EVENT_SHOW_START_TIME_REQUIRED: 'EVENT_SHOW_START_TIME_REQUIRED',
  VENUE_TC_REQUIRED: 'VENUE_TC_REQUIRED',
  VENUE_SC_REQUIRED: 'VENUE_SC_REQUIRED',
  VENUE_EN_REQUIRED: 'VENUE_EN_REQUIRED',
  EVENT_PHONE_LABEL_TC_REQUIRED: 'EVENT_PHONE_LABEL_TC_REQUIRED',
  EVENT_PHONE_LABEL_SC_REQUIRED: 'EVENT_PHONE_LABEL_SC_REQUIRED',
  EVENT_PHONE_LABEL_EN_REQUIRED: 'EVENT_PHONE_LABEL_EN_REQUIRED',
  EVENT_PHONE_PHONE_REQUIRED: 'EVENT_PHONE_PHONE_REQUIRED',

  // db check
  EVENT_NOT_EXISTS: 'EVENT_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS'
};
