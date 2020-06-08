const userRoles = {
  ADMIN: { value: 'ADMIN', label: 'Admin' },
  EDITOR: { value: 'EDITOR', label: 'Normal user' }
};

export default userRoles;

export const isAdmin = user => {
  return user.role === userRoles.ADMIN.value;
};

export const userRoleOptions = Object.values(userRoles);
