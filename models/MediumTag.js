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
