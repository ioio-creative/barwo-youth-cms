import { formatDateTimeString } from 'utils/datetime';

const artistTypes = {
  ARTISTIC_DIRECTOR: { value: 'ARTISTIC_DIRECTOR', label: 'Artistic director' },
  ARTISTIC_DIRECTOR_VISITING: {
    value: 'ARTISTIC_DIRECTOR_VISITING',
    label: 'Artistic director visiting'
  },
  ACTOR: { value: 'ACTOR', label: 'Actor' },
  ACTOR_PAST: { value: 'ACTOR_PAST', label: 'Actor past' }
};

const artistRoles = {
  NOT_SPECIFIED: { value: 'NOT_SPECIFIED', label: 'Not specified' },
  MALE: { value: 'MALE', label: 'Male' },
  FEMALE: { value: 'FEMALE', label: 'Female' },
  BOTH: { value: 'BOTH', label: 'Both' }
};

function Artist() {
  this.name_tc = '';
  this.name_sc = '';
  this.name_en = '';
  this.desc_tc = '';
  this.desc_sc = '';
  this.desc_en = '';
  this.type = artistTypes.ACTOR.value;
  this.role = artistRoles.NOT_SPECIFIED.value;
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

Artist.artistsResponseTypes = {
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
  TYPE_REQUIRED: {
    type: 'TYPE_REQUIRED',
    msg: 'TYPE_REQUIRED'
  },
  ROLE_REQUIRED: {
    type: 'ROLE_REQUIRED',
    msg: 'ROLE_REQUIRED'
  },

  // db check
  ARTIST_NOT_EXISTS: {
    type: 'ARTIST_NOT_EXISTS',
    msg: 'ARTIST_NOT_EXISTS'
  }
};

Artist.artistTypes = artistTypes;
Artist.artistTypeOptions = Object.values(artistTypes);

Artist.artistRoles = artistRoles;
Artist.artistRoleOptions = Object.values(artistRoles);

Artist.getArtistForDisplay = artist => {
  return {
    ...artist,
    typeDisplay: artistTypes[artist.type].label,
    roleDisplay: artistRoles[artist.role].label,
    createDTDisplay: formatDateTimeString(artist.createDT),
    lastModifyDTDisplay: formatDateTimeString(artist.lastModifyDT),
    lastModifyUserDisplay: artist.lastModifyUser
      ? artist.lastModifyUser.name
      : '',
    isEnabledDisplay: artist.isEnabled.toString()
  };
};

/* end of statics */

export default Artist;
