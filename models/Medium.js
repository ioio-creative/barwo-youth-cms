const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MediumSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  alernativeText: {
    type: String
  },
  type: {
    type: String
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'mediumTag'
    }
  ],
  url: {
    type: String
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

MediumSchema.plugin(mongoosePaginate);

module.exports.Medium = mongoose.model('medium', MediumSchema);

module.exports.mediumTypes = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  PDF: 'PDF'
};
