import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function Medium() {
  this.name = '';
  this.alternativeText = '';
  this.type = '';
  this.tags = [];
  this.url = '';
  this.usages = [];
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

Medium.mediaResponseTypes = {
  // MulterError
  TOO_MANY_FILES: { type: 'TOO_MANY_FILES', msg: 'TOO_MANY_FILES' },
  FILE_TOO_LARGE: { type: 'FILE_TOO_LARGE', msg: 'FILE_TOO_LARGE' },
  NO_FILE_UPLOADED_OR_OF_WRONG_TYPE: {
    type: 'NO_FILE_UPLOADED_OR_OF_WRONG_TYPE',
    msg: 'NO_FILE_UPLOADED_OR_OF_WRONG_TYPE'
  },

  // input validation
  NAME_REQUIRED: { type: 'NAME_REQUIRED', msg: 'NAME_REQUIRED' },
  TYPE_REQUIRED: { type: 'TYPE_REQUIRED', msg: 'TYPE_REQUIRED' },
  WRONG_TYPE: { type: 'WRONG_TYPE', msg: 'WRONG_TYPE' },
  URL_REQUIRED: { type: 'URL_REQUIRED', msg: 'URL_REQUIRED' },

  // db check
  MEDIUM_TYPE_NOT_EXISTS: {
    type: 'MEDIUM_TYPE_NOT_EXISTS',
    msg: 'MEDIUM_TYPE_NOT_EXISTS'
  },
  MEDIUM_NOT_EXISTS: {
    type: 'MEDIUM_NOT_EXISTS',
    msg: 'MEDIUM_NOT_EXISTS'
  },
  NAME_ALREADY_EXISTS: {
    type: 'NAME_ALREADY_EXISTS',
    msg: 'NAME_ALREADY_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

const mediumTypes = {
  IMAGE: { value: 'IMAGE', label: 'image', apiRoute: 'images' },
  VIDEO: { value: 'VIDEO', label: 'video', apiRoute: 'videos' },
  AUDIO: { value: 'AUDIO', label: 'audio', apiRoute: 'audios' },
  BOTH: { value: 'PDF', label: 'pdf', apiRoute: 'pdfs' }
};

Medium.mediumTypes = mediumTypes;

Medium.getMediumForDisplay = medium => {
  return {
    ...medium,
    createDTDisplay: formatDateTimeString(medium.createDT),
    lastModifyDTDisplay: formatDateTimeString(medium.lastModifyDT),
    lastModifyUserDisplay: medium.lastModifyUser
      ? medium.lastModifyUser.name
      : '',
    isEnabledDisplay: medium.isEnabled.toString()
  };
};

Medium.getMediumTypeFromApiRoute = apiRoute => {
  return Object.values(mediumTypes).find(x => x.apiRoute === apiRoute);
};

const displayFieldNames = [
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

Medium.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default Medium;
