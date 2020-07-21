import { generatePath } from 'react-router-dom';
import Medium from 'models/medium';

const mediumTypes = Medium.mediumTypes;

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
  newsList: function (isLink) {
    return '/newsList';
  },
  newsEditById: '/newsEdit/:newsId',
  newsEditByIdWithValue: function (isLink, newsId) {
    return '/newsEdit/' + newsId;
  },
  newsAdd: function (isLink) {
    return '/newsAdd';
  },
  aboutEdit: function (isLink) {
    return '/aboutEdit';
  },
  globalConstantsEdit: function (isLink) {
    return '/globalConstantsEdit';
  },
  landingPageEdit: function (isLink) {
    return '/landingPageEdit';
  },
  contactList: function (isLink) {
    return '/contactList';
  },
  contactEditById: '/contactEdit/:contactId',
  contactEditByIdWithValue: function (isLink, contactId) {
    return '/contactEdit/' + contactId;
  },
  contactAdd: function (isLink) {
    return '/contactAdd';
  },
  newsletterList: function (isLink) {
    return '/newsletterList';
  },
  newsletterEditById: '/newsletterEdit/:newsletterId',
  newsletterEditByIdWithValue: function (isLink, newsletterId) {
    return '/newsletterEdit/' + newsletterId;
  },
  newsletterAdd: function (isLink) {
    return '/newsletterAdd';
  },
  sendHistoryList: function (isLink) {
    return '/sendHistoryList';
  },
  sendHistoryViewById: '/sendHistoryView/:sendHistoryId',
  sendHistoryViewByIdWithValue: function (isLink, sendHistoryId) {
    return '/sendHistoryView/' + sendHistoryId;
  },

  fileManager: '/fileManager/:fileType/:additionalCallbackParam?',
  fileManagerForImages: function (isLink) {
    return generatePath(this.fileManager, {
      fileType: mediumTypes.IMAGE.apiRoute
    });
  },
  fileManagerForVideos: function (isLink) {
    return generatePath(this.fileManager, {
      fileType: mediumTypes.VIDEO.apiRoute
    });
  },
  fileManagerForAudios: function (isLink) {
    return generatePath(this.fileManager, {
      fileType: mediumTypes.AUDIO.apiRoute
    });
  },
  fileManagerForPdfs: function (isLink) {
    return generatePath(this.fileManager, {
      fileType: mediumTypes.PDF.apiRoute
    });
  },

  testing: '/testing'
};
