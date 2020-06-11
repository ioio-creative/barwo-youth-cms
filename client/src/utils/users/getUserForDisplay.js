import userRoles from 'types/userRoles';

export default user => {
  return {
    ...user,
    roleDisplay: userRoles[user.role].label,
    lastModifyUserDisplay: user.lastModifyUser.name,
    isEnabledDisplay: user.isEnabled.toString()
  };
};
