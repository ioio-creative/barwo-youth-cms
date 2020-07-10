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
  editPasswordWithId: function (isLink, userId) {
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
  ticketingDefaultEdit: function (isLink) {
    return '/ticketingDefaultEdit';
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
  activityList: function (isLink) {
    return '/activityList';
  },
  activityEditById: '/activityEdit/:activityId',
  activityEditByIdWithValue: function (isLink, activityId) {
    return '/activityEdit/' + activityId;
  },
  activityAdd: function (isLink) {
    return '/activityAdd';
  },
  globalConstantsEdit: function (isLink) {
    return '/globalConstantsEdit';
  },
  landingPageEdit: function (isLink) {
    return '/landingPageEdit';
  },
  contactEditById: '/contactEdit/:contactId',
  contactList: function (isLink) {
    return '/contactList';
  },
  contactAdd: function (isLink) {
    return '/contactAdd';
  },
  fileManager: '/fileManager/:fileType/:additionalCallbackParam?',
  testing: '/testing'
};
