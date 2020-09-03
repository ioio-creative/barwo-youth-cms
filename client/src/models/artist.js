import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import ArtistsOrderWithContainer from 'components/pages/ArtistsOrder';

const artistTypes = {
  ART_DIRECTOR: { value: 'ART_DIRECTOR', label: 'Artistic director' },
  // ART_DIRECTOR_VISITING: {
  //   value: 'ART_DIRECTOR_VISITING',
  //   label: 'Artistic director visiting'
  // },
  ACTOR: { value: 'ACTOR', label: 'Actor' }
  // ACTOR_PAST: { value: 'ACTOR_PAST', label: 'Actor past' }
};

const artistRoles = {
  //NOT_SPECIFIED: { value: 'NOT_SPECIFIED', label: 'Not specified' },
  MALE: { value: 'MALE', label: 'Male' },
  FEMALE: { value: 'FEMALE', label: 'Female' }
  //BOTH: { value: 'BOTH', label: 'Both' }
};

const artDirectorTypes = [
  artistTypes.ART_DIRECTOR
  //artistTypes.ART_DIRECTOR_VISITING
];

const artDirectoryTypeValues = artDirectorTypes.map(type => type.value);

const isArtDirector = artist => {
  return artDirectoryTypeValues.includes(artist.type);
};

function Artist() {
  this.label = '';
  this.order = null;
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';
  this.type = artistTypes.ACTOR.value;
  this.role = artistRoles.MALE.value;
  this.directorRemarks_tc = '';
  this.directorRemarks_sc = '';
  this.directorRemarks_en = '';
  this.desc_tc = '';
  this.desc_sc = '';
  this.desc_en = '';
  this.qnas = [];
  /* media */
  this.featuredImage = '';
  this.withoutMaskImage = '';
  this.gallery = [];
  this.sound = '';
  /* end of media */
  this.pageMeta = null;
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

Artist.artistsResponseTypes = {
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
  TYPE_REQUIRED: {
    type: 'TYPE_REQUIRED',
    msg: 'TYPE_REQUIRED'
  },
  ROLE_REQUIRED: {
    type: 'ROLE_REQUIRED',
    msg: 'ROLE_REQUIRED'
  },
  ARTIST_QnA_QUESTION_TC_REQUIRED: {
    type: 'ARTIST_QnA_QUESTION_TC_REQUIRED',
    msg: 'ARTIST_QnA_QUESTION_TC_REQUIRED'
  },
  ARTIST_QnA_ANSWER_TC_REQUIRED: {
    type: 'ARTIST_QnA_ANSWER_TC_REQUIRED',
    msg: 'ARTIST_QnA_ANSWER_TC_REQUIRED'
  },
  ARTIST_QnA_QUESTION_SC_REQUIRED: {
    type: 'ARTIST_QnA_QUESTION_SC_REQUIRED',
    msg: 'ARTIST_QnA_QUESTION_SC_REQUIRED'
  },
  ARTIST_QnA_ANSWER_SC_REQUIRED: {
    type: 'ARTIST_QnA_ANSWER_SC_REQUIRED',
    msg: 'ARTIST_QnA_ANSWER_SC_REQUIRED'
  },
  ARTIST_QnA_QUESTION_EN_REQUIRED: {
    type: 'ARTIST_QnA_QUESTION_EN_REQUIRED',
    msg: 'ARTIST_QnA_QUESTION_EN_REQUIRED'
  },
  ARTIST_QnA_ANSWER_EN_REQUIRED: {
    type: 'ARTIST_QnA_ANSWER_EN_REQUIRED',
    msg: 'ARTIST_QnA_ANSWER_EN_REQUIRED'
  },

  // db check
  ARTIST_NOT_EXISTS: {
    type: 'ARTIST_NOT_EXISTS',
    msg: 'ARTIST_NOT_EXISTS'
  },
  LABEL_ALREADY_EXISTS: {
    type: 'LABEL_ALREADY_EXISTS',
    msg: 'LABEL_ALREADY_EXISTS'
  },
  ARTIST_PERFORMED_IN_EVENTS: {
    type: 'ARTIST_PERFORMED_IN_EVENTS',
    msg: "ARTIST_PERFORMED_IN_EVENTS, hence can't be deleted"
  },
  ARTIST_DIRECTED_IN_EVENTS: {
    type: 'ARTIST_DIRECTED_IN_EVENTS',
    msg: "ARTIST_DIRECTED_IN_EVENTS, hence can't be deleted"
  },
  ARTIST_FEATURED_IN_LANDING: {
    type: 'ARTIST_FEATURED_IN_LANDING',
    msg: "ARTIST_FEATURED_IN_LANDING, hence can't be deleted"
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

Artist.artistTypes = artistTypes;
Artist.artistTypeOptions = Object.values(artistTypes);

Artist.artistRoles = artistRoles;
Artist.artistRoleOptions = Object.values(artistRoles);

Artist.isArtDirector = isArtDirector;

Artist.getArtistForDisplay = artist => {
  return {
    ...artist,
    orderDisplay: Number.isInteger(artist.order) ? artist.order + 1 : '',
    typeDisplay: artistTypes[artist.type].label,
    roleDisplay: artistRoles[artist.role].label,
    createDTDisplay: formatDateTimeString(artist.createDT),
    lastModifyDTDisplay: formatDateTimeString(artist.lastModifyDT),
    lastModifyUserDisplay: artist.lastModifyUser
      ? artist.lastModifyUser.name
      : '',
    isEnabledDisplay: artist.isEnabled.toString(),
    qnasDisplay: firstOrDefault(artist.qnas, { question_tc: '' }).question_tc
  };
};

const displayFieldNames = [
  'orderDisplay',
  'typeDisplay',
  'roleDisplay',
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay',
  'qnasDisplay'
];

Artist.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default Artist;
