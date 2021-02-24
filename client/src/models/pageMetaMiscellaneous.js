import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function PageMetaMiscellaneous() {
  this.landingPageMeta = null;
  this.aboutMeta = null;
  this.artistListMeta = null;
  this.eventListMeta = null;
  this.activityListMeta = null;
  this.newsListMeta = null;
  this.mediaListMeta = null;
  this.recruitmentMeta = null;

  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

PageMetaMiscellaneous.pageMetaMiscellaneousResponseTypes = {
  // input validation

  // db check
  PAGE_META_MISCELLANEOUS_NOT_EXISTS: {
    type: 'PAGE_META_MISCELLANEOUS_NOT_EXISTS',
    msg: 'PAGE_META_MISCELLANEOUS_NOT_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

PageMetaMiscellaneous.getPageMetaMiscellaneousForDisplay = pageMetaMiscellaneous => {
  return {
    ...pageMetaMiscellaneous,
    lastModifyDTDisplay: formatDateTimeString(
      pageMetaMiscellaneous.lastModifyDT
    ),
    lastModifyUserDisplay: pageMetaMiscellaneous.lastModifyUser
      ? pageMetaMiscellaneous.lastModifyUser.name
      : ''
  };
};

const displayFieldNames = ['lastModifyDTDisplay', 'lastModifyUserDisplay'];

PageMetaMiscellaneous.cleanSortByString = cleanSortByStringFuncGen(
  displayFieldNames
);

/* end of statics */

export default PageMetaMiscellaneous;
