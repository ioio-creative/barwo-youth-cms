import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';
import { getArraySafe } from '../utils/js/array/isNonEmptyArray';

// const contactTypes = {
//   MISS: { value: 'MISS', label: 'Miss' },
//   MR: { value: 'MR', label: 'Mr' },
//   MRS: { value: 'MRS', label: 'Mrs' },
//   NOT_SPECIFIED: { value: 'NOT_SPECIFIED', label: 'Not specified' }
// };

const contactLanguage = {
  TC: { value: 'TC', label: 'Traditional Chinese' },
  SC: { value: 'SC', label: 'Simplified Chinese' },
  EN: { value: 'EN', label: 'English' }
};

const contactGroups = {
  MEDIA: { value: 'MEDIA', _id: 'MEDIA', label: 'Media/Press' },
  EDM: { value: 'EDM', _id: 'EDM', label: 'EDM Subscribers' },
  YMT: { value: 'YMT', _id: 'YMT', label: 'Committee (YMT)' },
  BARWO: { value: 'BARWO', _id: 'BARWO', label: 'Committee (BARWO)' },
  PRIMANY: { value: 'PRIMANY', _id: 'PRIMANY', label: 'Primary School' },
  SECONDARY: {
    value: 'SECONDARY',
    _id: 'SECONDARY',
    label: 'Secondary School'
  },
  UNIVERSITY: { value: 'UNIVERSITY', _id: 'UNIVERSITY', label: 'University' },
  FAMILY: { value: 'FAMILY', _id: 'FAMILY', label: 'Family' }
};

function Contact() {
  this.emailAddress = '';
  this.name = '';
  //this.type = contactTypes.NOT_SPECIFIED.value;
  this.language = contactLanguage.EN.value;
  this.groups = [contactGroups.EDM.value];

  this.isEnabled = true;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

Contact.contactResponseTypes = {
  // input validation
  EMAIL_ADDRESS_INVALID: {
    type: 'EMAIL_ADDRESS_INVALID',
    msg: 'EMAIL_ADDRESS_INVALID'
  },
  // NAME_REQUIRED: {
  //   type: 'NAME_REQUIRED',
  //   msg: 'NAME_REQUIRED'
  // },
  // TYPE_REQUIRED: {
  //   type: 'TYPE_REQUIRED',
  //   msg: 'TYPE_REQUIRED'
  // },
  LANGUAGE_REQUIRED: {
    type: 'LANGUAGE_REQUIRED',
    msg: 'LANGUAGE_REQUIRED'
  },

  // db check
  CONTACT_NOT_EXISTS: {
    type: 'CONTACT_NOT_EXISTS',
    msg: 'CONTACT_NOT_EXISTS'
  },
  EMAIL_ADDRESS_ALREADY_EXISTS: {
    type: 'EMAIL_ADDRESS_ALREADY_EXISTS',
    msg: 'EMAIL_ADDRESS_ALREADY_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

// Contact.contactTypes = contactTypes;
// Contact.contactTypeOptions = Object.values(contactTypes);
Contact.contactLanguage = contactLanguage;
Contact.contactLanguageOptions = Object.values(contactLanguage);

Contact.contactGroups = contactGroups;
Contact.contactGroupOptions = Object.values(contactGroups);

Contact.getContactForDisplay = contact => {
  return {
    ...contact,
    // typeDisplay: contactTypes[contact.type].label,
    languageDisplay: contactLanguage[contact.language.toUpperCase()].label,
    groupsDisplay: getArraySafe(contact.groups)
      .filter(x => x)
      .map(group => {
        return contactGroups[group].label;
      })
      .join(', '),
    lastModifyDTDisplay: formatDateTimeString(contact.lastModifyDT),
    lastModifyUserDisplay: contact.lastModifyUser
      ? contact.lastModifyUser.name
      : '',
    isEnabledDisplay: contact.isEnabled.toString()
  };
};

const displayFieldNames = [
  'typeDisplay',
  'languageDisplay',
  'groupsDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

Contact.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default Contact;
