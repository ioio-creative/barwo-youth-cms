const mongoose = require('mongoose');

const ArtistSchema = mongoose.Schema({
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
  type: {
    type: String,
    require: true
  },
  role: {
    type: String,
    require: true
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

module.exports.Artist = mongoose.model('artist', ArtistSchema);

module.exports.artistRoles = {
  NOT_SPECIFIED: 'NOT_SPECIFIED',
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  BOTH: 'BOTH'
};

module.exports.artistTypes = {
  ARTISTIC_DIRECTOR: 'ARTISTIC_DIRECTOR',
  ARTISTIC_DIRECTOR_VISITING: 'ARTISTIC_DIRECTOR_VISITING',
  ACTOR: 'ACTOR',
  ACTOR_PAST: 'ACTOR_PAST'
};

module.exports.artistResponseTypes = {
  // input validation
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',
  TYPE_REQUIRED: 'TYPE_REQUIRED',
  ROLE_REQUIRED: 'ROLE_REQUIRED',

  // db check
  ARTIST_NOT_EXISTS: 'ARTIST_NOT_EXISTS'
};
