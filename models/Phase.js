const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PhaseSchema = mongoose.Schema({
  year: {
    type: Number,
    require: true
  },
  phaseNumber: {
    type: Number,
    require: true
  },
  derivedLabel: {
    type: String,
    require: true,
    unique: true
  },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }],
  themeColor: {
    type: String
  },
  fromDate: {
    type: Date,
    require: true
  },
  toDate: {
    type: Date
  },
  downloadName_tc: {
    type: String
  },
  downloadName_sc: {
    type: String
  },
  downloadName_en: {
    type: String
  },
  downloadMedium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  createDT: {
    type: Date,
    default: Date.now
  },
  lastModifyDT: {
    type: Date,
    default: Date.now
  },
  lastModifyUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

PhaseSchema.plugin(mongoosePaginate);

module.exports.Phase = mongoose.model('phase', PhaseSchema);

module.exports.phaseResponseTypes = {
  // input validation
  YEAR_REQUIRED: 'YEAR_REQUIRED',
  PHASE_NUMBER_REQUIRED: 'PHASE_NUMBER_REQUIRED',
  FROM_DATE_REQUIRED: 'FROM_DATE_REQUIRED',

  // db check
  PHASE_NOT_EXISTS: 'PHASE_NOT_EXISTS',
  PHASE_YEAR_NUMBER_COMBO_ALREADY_EXISTS:
    'PHASE_YEAR_NUMBER_COMBO_ALREADY_EXISTS'
};

module.exports.getPhaseDerivedLabel = (year, phaseNumber) => {
  return (
    year.toString().padStart(4, '0') +
    '_' +
    phaseNumber.toString().padStart(2, '0')
  );
};
