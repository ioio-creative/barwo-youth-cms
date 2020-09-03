const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { PageMetaSchema } = require('./PageMeta');

const ArtistQnaSchema = mongoose.Schema({
  question_tc: {
    type: String,
    require: true
  },
  answer_tc: {
    type: String,
    require: true
  },
  question_sc: {
    type: String,
    require: true
  },
  answer_sc: {
    type: String,
    require: true
  },
  question_en: {
    type: String,
    require: true
  },
  answer_en: {
    type: String,
    require: true
  }
});

const ArtistSchema = mongoose.Schema({
  label: {
    type: String,
    require: true,
    unique: true
  },
  order: {
    type: Number
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
  directorRemarks_tc: {
    type: String
  },
  directorRemarks_sc: {
    type: String
  },
  directorRemarks_en: {
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
  qnas: [ArtistQnaSchema],
  /* media */
  featuredImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  withoutMaskImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  gallery: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'medium'
    }
  ],
  sound: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  /* end of media */
  /* indication of relationships */
  eventsDirected: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }],
  eventsPerformed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }],
  // isFeaturedInLandingPage: {
  //   type: Boolean,
  //   default: false
  // },
  /* end of indication of relationships */
  pageMeta: PageMetaSchema,
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
  //NOT_SPECIFIED: 'NOT_SPECIFIED',
  MALE: 'MALE',
  FEMALE: 'FEMALE'
  //BOTH: 'BOTH'
};

const artistTypes = {
  ART_DIRECTOR: 'ART_DIRECTOR',
  //ART_DIRECTOR_VISITING: 'ART_DIRECTOR_VISITING',
  ACTOR: 'ACTOR'
  //ACTOR_PAST: 'ACTOR_PAST'
};

const artDirectorTypes = [
  artistTypes.ART_DIRECTOR
  //artistTypes.ART_DIRECTOR_VISITING
];

module.exports.artistTypes = artistTypes;

module.exports.artDirectorTypes = artDirectorTypes;

module.exports.isArtDirector = artist => {
  return artDirectorTypes.includes(artist.type);
};

module.exports.artistResponseTypes = {
  // input validation
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',
  TYPE_REQUIRED: 'TYPE_REQUIRED',
  ROLE_REQUIRED: 'ROLE_REQUIRED',
  ARTIST_QnA_QUESTION_TC_REQUIRED: 'ARTIST_QnA_QUESTION_TC_REQUIRED',
  ARTIST_QnA_ANSWER_TC_REQUIRED: 'ARTIST_QnA_ANSWER_TC_REQUIRED',
  ARTIST_QnA_QUESTION_SC_REQUIRED: 'ARTIST_QnA_QUESTION_SC_REQUIRED',
  ARTIST_QnA_ANSWER_SC_REQUIRED: 'ARTIST_QnA_ANSWER_SC_REQUIRED',
  ARTIST_QnA_QUESTION_EN_REQUIRED: 'ARTIST_QnA_QUESTION_EN_REQUIRED',
  ARTIST_QnA_ANSWER_EN_REQUIRED: 'ARTIST_QnA_ANSWER_EN_REQUIRED',

  // db check
  ARTIST_NOT_EXISTS: 'ARTIST_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS',
  ARTIST_PERFORMED_IN_EVENTS: 'ARTIST_PERFORMED_IN_EVENTS',
  ARTIST_DIRECTED_IN_EVENTS: 'ARTIST_DIRECTED_IN_EVENTS'
  //ARTIST_FEATURED_IN_LANDING: 'ARTIST_FEATURED_IN_LANDING'
};
