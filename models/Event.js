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

const EventScenaristSchema = mongoose.Schema({
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
  }
});

// const EventPriceSchema = mongoose.Schema({
//   price_tc: {
//     type: String,
//     require: true
//   },
//   price_sc: {
//     type: String,
//     require: true
//   },
//   price_en: {
//     type: String,
//     require: true
//   }
// });

// const EventPhoneSchema = mongoose.Schema({
//   label_tc: {
//     type: String,
//     require: true
//   },
//   label_sc: {
//     type: String,
//     require: true
//   },
//   label_en: {
//     type: String,
//     require: true
//   },
//   phone: {
//     type: String,
//     require: true
//   }
// });

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
  scenarists: [EventScenaristSchema],
  descHeadline_tc: {
    type: String
  },
  descHeadline_sc: {
    type: String
  },
  descHeadline_en: {
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
  artDirectors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'artist' }],
  artists: [EventArtistSchema],
  /* ticketing */
  // venue_tc: {
  //   type: String,
  //   require: true
  // },
  // venue_sc: {
  //   type: String,
  //   require: true
  // },
  // venue_en: {
  //   type: String,
  //   require: true
  // },
  // prices: [EventPriceSchema],
  // priceRemarks_tc: {
  //   type: String
  // },
  // priceRemarks_sc: {
  //   type: String
  // },
  // priceRemarks_en: {
  //   type: String
  // },
  // phones: [EventPhoneSchema],
  // ticketUrl: {
  //   type: String
  // },
  /* end of ticketing */
  /* media */
  featuredImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'medium' }],
  /* end of media */
  phasesInvolved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'phase' }],
  themeColor: {
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
  EVENT_SCENARIST_NAME_TC_REQUIRED: 'EVENT_SCENARIST_NAME_TC_REQUIRED',
  EVENT_SCENARIST_NAME_SC_REQUIRED: 'EVENT_SCENARIST_NAME_SC_REQUIRED',
  EVENT_SCENARIST_NAME_EN_REQUIRED: 'EVENT_SCENARIST_NAME_EN_REQUIRED',
  // VENUE_TC_REQUIRED: 'VENUE_TC_REQUIRED',
  // VENUE_SC_REQUIRED: 'VENUE_SC_REQUIRED',
  // VENUE_EN_REQUIRED: 'VENUE_EN_REQUIRED',
  // EVENT_PHONE_LABEL_TC_REQUIRED: 'EVENT_PHONE_LABEL_TC_REQUIRED',
  // EVENT_PHONE_LABEL_SC_REQUIRED: 'EVENT_PHONE_LABEL_SC_REQUIRED',
  // EVENT_PHONE_LABEL_EN_REQUIRED: 'EVENT_PHONE_LABEL_EN_REQUIRED',
  // EVENT_PHONE_PHONE_REQUIRED: 'EVENT_PHONE_PHONE_REQUIRED',
  // EVENT_PRICE_PRICE_TC_REQUIRED: 'EVENT_PRICE_PRICE_TC_REQUIRED',
  // EVENT_PRICE_PRICE_SC_REQUIRED: 'EVENT_PRICE_PRICE_SC_REQUIRED',
  // EVENT_PRICE_PRICE_EN_REQUIRED: 'EVENT_PRICE_PRICE_EN_REQUIRED',

  // db check
  EVENT_NOT_EXISTS: 'EVENT_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS',
  EVENT_USED_IN_PHASE: 'EVENT_USED_IN_PHASE'
};
