export default {
  home: function (isLink) {
    return '/';
  },
  login: function (isLink) {
    return '/login';
  },
  userList: function (isLink) {
    return '/userList';
  },
  userEditById: '/userEdit/:userId',
  userEditByIdWithValue: function (isLink, userId) {
    return '/userEdit/' + userId;
  },
  userAdd: function (isLink) {
    return '/userAdd';
  }
};
