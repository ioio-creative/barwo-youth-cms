const userRoles = {
  ADMIN: { _id: 'ADMIN', display: 'Admin' },
  NORMAL_USER: { _id: 'NORMAL_USER', display: 'Normal user' }
};

export default userRoles;

export const isAdmin = user => {
  return user.role === userRoles.ADMIN._id;
};
