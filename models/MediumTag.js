const mongoose = require('mongoose');

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

module.exports.MediumTag = mongoose.model('mediumTag', MediumTagSchema);
