const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ArtistSchema = mongoose.Schema({
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
  type: {
    type: String,
    require: true
  },
  role: {
    type: String,
    require: true
  },
  featuredImage: {
    type: String
  },
  withoutMaskImage: {
    type: String
  },
  gallery: {
    type: [String]
  },
  sound: {
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
  question_tc: {
    type: [String]
  },
  answer_tc: {
    type: [String]
  },
  question_sc: {
    type: [String]
  },
  answer_sc: {
    type: [String]
  },
  question_en: {
    type: [String]
  },
  answer_en: {
    type: [String]
  },
  eventsDirected: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }],
  eventsPerformed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }],
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

ArtistSchema.plugin(mongoosePaginate);

module.exports.Artist = mongoose.model('artist', ArtistSchema);

module.exports.artistRoles = {
  NOT_SPECIFIED: 'NOT_SPECIFIED',
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  BOTH: 'BOTH'
};

module.exports.artistTypes = {
  ART_DIRECTOR: 'ART_DIRECTOR',
  ART_DIRECTOR_VISITING: 'ART_DIRECTOR_VISITING',
  ACTOR: 'ACTOR',
  ACTOR_PAST: 'ACTOR_PAST'
};

module.exports.artistResponseTypes = {
  // input validation
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',
  TYPE_REQUIRED: 'TYPE_REQUIRED',
  ROLE_REQUIRED: 'ROLE_REQUIRED',

  // db check
  ARTIST_NOT_EXISTS: 'ARTIST_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS'
};
