import { formatDateTimeString, formatDateString } from 'utils/datetime';
import firstOrDefault from 'utils/js/array/firstOrDefault';
import range from 'utils/js/number/range';
import generalResponseTypes from 'types/responses/general';
import cleanSortByStringFuncGen from './utils/cleanSortByStringFuncGen';

const mapYearToDisplay = year => `${year}-${year + 1}`;

function Phase() {
  this.year = new Date().getFullYear();
  this.phaseNumber = 1;
  this.events = [];
  this.themeColor = null;
  this.fromDate = null;
  this.toDate = null;
  this.downloadName_tc = '';
  this.downloadName_sc = '';
  this.downloadName_en = '';
  this.downloadMedium = '';
  this.ticketSaleRemarks_tc = '';
  this.ticketSaleRemarks_sc = '';
  this.ticketSaleRemarks_en = '';
  this.isEnabled = true;
  this.createDT = null;
  this.lastModifyDT = null;
  this.lastModifyUser = null;
}

/* statics */

Phase.phasesResponseTypes = {
  // input validation
  YEAR_REQUIRED: {
    type: 'YEAR_REQUIRED',
    msg: 'YEAR_REQUIRED'
  },
  PHASE_NUMBER_REQUIRED: {
    type: 'PHASE_NUMBER_REQUIRED',
    msg: 'PHASE_NUMBER_REQUIRED'
  },
  FROM_DATE_REQUIRED: {
    type: 'FROM_DATE_REQUIRED',
    msg: 'FROM_DATE_REQUIRED'
  },

  // db check
  PHASE_NOT_EXISTS: {
    type: 'PHASE_NOT_EXISTS',
    msg: 'PHASE_NOT_EXISTS'
  },
  PHASE_YEAR_NUMBER_COMBO_ALREADY_EXISTS: {
    type: 'PHASE_YEAR_NUMBER_COMBO_ALREADY_EXISTS',
    msg: 'PHASE_YEAR_NUMBER_COMBO_ALREADY_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

Phase.yearOptions = range(2015, 2040).map(year => {
  return {
    value: year,
    label: mapYearToDisplay(year)
  };
});

Phase.phaseNumberOptions = range(1, 12).map(phaseNumber => {
  return {
    value: phaseNumber,
    label: phaseNumber.toString()
  };
});

Phase.getPhaseForDisplay = phase => {
  return {
    ...phase,
    yearDisplay: mapYearToDisplay(phase.year),
    eventsDisplay: firstOrDefault(phase.events, { label: '' }).label,
    fromDateDisplay: phase.fromDate ? formatDateString(phase.fromDate) : null,
    toDateDisplay: phase.toDate ? formatDateString(phase.toDate) : null,
    createDTDisplay: formatDateTimeString(phase.createDT),
    lastModifyDTDisplay: formatDateTimeString(phase.lastModifyDT),
    lastModifyUserDisplay: phase.lastModifyUser
      ? phase.lastModifyUser.name
      : '',
    isEnabledDisplay: phase.isEnabled.toString()
  };
};

const displayFieldNames = [
  'yearDisplay',
  'eventsDisplay',
  'fromDateDisplay',
  'toDateDisplay',
  'createDTDisplay',
  'lastModifyDTDisplay',
  'lastModifyUserDisplay',
  'isEnabledDisplay'
];

Phase.cleanSortByString = cleanSortByStringFuncGen(displayFieldNames);

/* end of statics */

export default Phase;
