const userRoles = {
  ADMIN: { value: 'ADMIN', label: 'Admin' },
  NORMAL_USER: { value: 'NORMAL_USER', label: 'Normal user' }
};

export default userRoles;

export const isAdmin = user => {
  return user.role === userRoles.ADMIN.value;
};

export const userRoleOptions = Object.values(userRoles);
