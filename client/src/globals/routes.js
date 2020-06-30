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
  },
  editPassword: '/editPassword/:userId',
  editPasswordWithValue: function (isLink, userId) {
    return '/editPassword/' + userId;
  },
  artistList: function (isLink) {
    return '/artistList';
  },
  artistEditById: '/artistEdit/:artistId',
  artistEditByIdWithValue: function (isLink, artistId) {
    return '/artistEdit/' + artistId;
  },
  artistAdd: function (isLink) {
    return '/artistAdd';
  },
  eventList: function (isLink) {
    return '/eventList';
  },
  eventEditById: '/eventEdit/:eventId',
  eventEditByIdWithValue: function (isLink, eventId) {
    return '/eventEdit/' + eventId;
  },
  eventAdd: function (isLink) {
    return '/eventAdd';
  },
  phaseList: function (isLink) {
    return '/phaseList';
  },
  phaseEditById: '/phaseEdit/:phaseId',
  phaseEditByIdWithValue: function (isLink, phaseId) {
    return '/phaseEdit/' + phaseId;
  },
  phaseAdd: function (isLink) {
    return '/phaseAdd';
  },
  testing: '/testing',
  fileManager: '/fileManager'
  // passwordChange: '/changePassword'
};
