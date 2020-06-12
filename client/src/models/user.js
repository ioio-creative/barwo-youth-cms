import { formatDateTimeString } from 'utils/datetime';

function User() {
  this.name = '';
  this.email = '';
  this.password = '';
  this.role = userRoles.EDITOR.value;
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

User.userResponseTypes = {
  // info messages
  USER_DELETED: {
    type: 'USER_DELETED',
    msg: 'USER_DELETED'
  },

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
  USER_ALREADY_EXISTS: {
    type: 'USER_ALREADY_EXISTS',
    msg: 'USER_ALREADY_EXISTS'
  },
  USER_NOT_EXISTS: {
    type: 'USER_NOT_EXISTS',
    msg: 'USER_NOT_EXISTS'
  }
};

const userRoles = {
  ADMIN: { value: 'ADMIN', label: 'Admin' },
  EDITOR: { value: 'EDITOR', label: 'Editor' }
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

/* end of statics */

export default User;
