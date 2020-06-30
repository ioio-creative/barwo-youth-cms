import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

function LandingPage() {
  this.featuredVideo = '';
  this.featuredVideo2 = '';
}

/* statics */

LandingPage.landingPageResponseTypes = {
  // input validation

  // db check
  LANDING_PAGE_NOT_EXISTS: 'LANDING_PAGE_NOT_EXISTS',

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

LandingPage.getLandingPageForDisplay = landingPage => {
  return {
    ...landingPage
  };
};

const displayFieldNames = [];

LandingPage.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default LandingPage;
