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

const EventSchema = mongoose.Schema({
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
  writer_tc: {
    type: String
  },
  writer_sc: {
    type: String
  },
  writer_en: {
    type: String
  },
  artDirectors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'artist' }],
  artists: [EventArtistSchema],
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
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',
  EVENT_ARTIST_ROLE_TC_REQUIRED: 'EVENT_ARTIST_ROLE_TC_REQUIRED',
  EVENT_ARTIST_ROLE_SC_REQUIRED: 'EVENT_ARTIST_ROLE_SC_REQUIRED',
  EVENT_ARTIST_ROLE_EN_REQUIRED: 'EVENT_ARTIST_ROLE_EN_REQUIRED',
  EVENT_ARTIST_REQUIRED: 'EVENT_ARTIST_REQUIRED',

  // db check
  EVENT_NOT_EXISTS: 'EVENT_NOT_EXISTS'
};
