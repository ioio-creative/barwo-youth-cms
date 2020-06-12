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
