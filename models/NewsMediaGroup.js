const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const NewsMediaGroupSchema = mongoose.Schema({
  year: {
    type: Number,
    require: true,
    unique: true
  },
  newsMediaItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'newsMediaItem' }
  ],
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

NewsMediaGroupSchema.plugin(mongoosePaginate);

module.exports.NewsMediaGroup = mongoose.model(
  'newsMediaGroup',
  NewsMediaGroupSchema
);

module.exports.newsMediaGroupResponseTypes = {
  // input validation
  YEAR_REQUIRED: 'YEAR_REQUIRED',

  // db check
  NEWS_MEDIA_GROUP_NOT_EXISTS: 'NEWS_MEDIA_GROUP_NOT_EXISTS',
  YEAR_ALREADY_EXISTS: 'YEAR_ALREADY_EXISTS'
};
