const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PhaseShowSchema = mongoose.Schema({
  date: {
    type: Date,
    require: true
  },
  startTime: {
    type: String,
    require: true
  }
});

const PhaseSchema = mongoose.Schema({
  year: {
    type: Number,
    require: true
  },
  shows: [PhaseShowSchema],
  time: {
    type: String
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

  // db check
  PHASE_NOT_EXISTS: 'PHASE_NOT_EXISTS',
  PHASE_YEAR_NUMBER_COMBO_ALREADY_EXISTS:
    'PHASE_YEAR_NUMBER_COMBO_ALREADY_EXISTS'
};
