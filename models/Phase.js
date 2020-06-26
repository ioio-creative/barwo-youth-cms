const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PhaseSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
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
