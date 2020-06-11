import userRoles from 'types/userRoles';
import { formatDateTimeString } from 'utils/datetime';

export default user => {
  return {
    ...user,
    roleDisplay: userRoles[user.role].label,
    createDTDisplay: formatDateTimeString(user.createDT),
    lastModifyDTDisplay: formatDateTimeString(user.lastModifyDT),
    lastModifyUserDisplay: user.lastModifyUser ? user.lastModifyUser.name : '',
    isEnabledDisplay: user.isEnabled.toString()
  };
};
