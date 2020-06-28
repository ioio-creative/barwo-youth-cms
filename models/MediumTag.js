const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MediumTagSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'medium'
    }
  ]
});

MediumTagSchema.plugin(mongoosePaginate);

module.exports.MediumTag = mongoose.model('mediumTag', MediumTagSchema);

module.exports.mediumTagResponseTypes = {
  // input validation
  NAME_REQUIRED: 'NAME_REQUIRED',

  // db check
  MEDIUM_TAG_NOT_EXISTS: 'MEDIUM_NOT_EXISTS',
  NAME_ALREADY_EXISTS: 'NAME_ALREADY_EXISTS'
};
