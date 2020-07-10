import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

const contactTypes = {
  MISS: { value: 'MISS', label: 'Miss' },
  MR: { value: 'MR', label: 'Mr' },
  MRS: { value: 'MRS', label: 'Mrs' },
  NOT_SPECIFIED: { value: 'NOT_SPECIFIED', label: 'Not specified' }
};

function Contact() {
  this.emailAddress = '';
  this.name = '';
  this.type = contactTypes.NOT_SPECIFIED.value;

  this.isEnabled = true;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

Contact.contactResponseTypes = {
  // input validation
  EMAIL_ADDRESS_REQUIRED: {
    type: 'EMAIL_ADDRESS_REQUIRED',
    msg: 'EMAIL_ADDRESS_REQUIRED'
  },
  NAME_REQUIRED: {
    type: 'NAME_REQUIRED',
    msg: 'NAME_REQUIRED'
  },
  TYPE_REQUIRED: {
    type: 'TYPE_REQUIRED',
    msg: 'TYPE_REQUIRED'
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

Contact.contactTypes = contactTypes;
Contact.contactTypeOptions = Object.values(contactTypes);

Contact.getContactForDisplay = contact => {
  return {
    ...contact,
    typeDisplay: contactTypes[contact.type].label,
    lastModifyDTDisplay: formatDateTimeString(contact.lastModifyDT),
    lastModifyUserDisplay: contact.lastModifyUser
      ? contact.lastModifyUser.name
      : '',
    isEnabledDisplay: contact.isEnabled.toString()
  };
};

const displayFieldNames = [
  'typeDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

Contact.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default Contact;
