import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function LandingPage() {
  this.featuredVideo = '';
  this.featuredVideo2 = '';
  this.featuredArtists = [];
  this.featuredActivities = [];
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

LandingPage.landingPageResponseTypes = {
  // input validation
  LANDING_PAGE_ARTIST_REQUIRED: {
    type: 'LANDING_PAGE_ARTIST_REQUIRED',
    msg: 'LANDING_PAGE_ARTIST_REQUIRED'
  },
  LANDING_PAGE_ACTIVITY_REQUIRED: {
    type: 'LANDING_PAGE_ACTIVITY_REQUIRED',
    msg: 'LANDING_PAGE_ACTIVITY_REQUIRED'
  },

  // db check
  LANDING_PAGE_NOT_EXISTS: {
    type: 'LANDING_PAGE_NOT_EXISTS',
    msg: 'LANDING_PAGE_NOT_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

LandingPage.getLandingPageForDisplay = landingPage => {
  return {
    ...landingPage,
    lastModifyDTDisplay: formatDateTimeString(landingPage.lastModifyDT),
    lastModifyUserDisplay: landingPage.lastModifyUser
      ? landingPage.lastModifyUser.name
      : ''
  };
};

const displayFieldNames = ['lastModifyDTDisplay', 'lastModifyUserDisplay'];

LandingPage.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default LandingPage;
