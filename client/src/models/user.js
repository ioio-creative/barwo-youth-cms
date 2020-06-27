import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

const userRoles = {
  ADMIN: { value: 'ADMIN', label: 'Admin' },
  EDITOR: { value: 'EDITOR', label: 'Editor' }
};

function User() {
  this.email = '';
  this.name = '';
  this.password = '';
  this.role = userRoles.EDITOR.value;
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

User.usersResponseTypes = {
  // info messages
  // USER_DELETED: {
  //   type: 'USER_DELETED',
  //   msg: 'USER_DELETED'
  // },

  // input validation
  NAME_REQUIRED: {
    type: 'NAME_REQUIRED',
    msg: 'NAME_REQUIRED'
  },
  EMAIL_INVALID: {
    type: 'EMAIL_INVALID',
    msg: 'EMAIL_INVALID'
  },
  PASSWORD_INVALID: {
    type: 'PASSWORD_INVALID',
    msg: 'PASSWORD_INVALID'
  },
  ROLE_REQUIRED: {
    type: 'ROLE_REQUIRED',
    msg: 'ROLE_REQUIRED'
  },

  // db check
  USER_NOT_EXISTS: {
    type: 'USER_NOT_EXISTS',
    msg: 'USER_NOT_EXISTS'
  },
  EMAIL_ALREADY_EXISTS: {
    type: 'EMAIL_ALREADY_EXISTS',
    msg: 'EMAIL_ALREADY_EXISTS'
  },
  NAME_ALREADY_EXISTS: {
    type: 'NAME_ALREADY_EXISTS',
    msg: 'NAME_ALREADY_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

User.userRoles = userRoles;
User.userRoleOptions = Object.values(userRoles);

User.isAdmin = user => {
  return user.role === userRoles.ADMIN.value;
};

User.getUserForDisplay = user => {
  return {
    ...user,
    roleDisplay: userRoles[user.role].label,
    createDTDisplay: formatDateTimeString(user.createDT),
    lastModifyDTDisplay: formatDateTimeString(user.lastModifyDT),
    lastModifyUserDisplay: user.lastModifyUser ? user.lastModifyUser.name : '',
    isEnabledDisplay: user.isEnabled.toString()
  };
};

const displayFieldNames = [
  'roleDisplay',
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

User.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default User;
