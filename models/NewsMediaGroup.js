const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const NewsMediaGroupSchema = mongoose.Schema({
  label: {
    type: String,
    require: true,
    unique: true
  },
  order: {
    type: Number
  },
  name_tc: {
    type: String,
    require: true
  },
  name_sc: {
    type: String,
    require: true
  },
  name_en: {
    type: String,
    require: true
  },
  year: {
    type: Number,
    require: true
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
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',
  YEAR_REQUIRED: 'YEAR_REQUIRED',

  // db check
  NEWS_MEDIA_GROUP_NOT_EXISTS: 'NEWS_MEDIA_GROUP_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS'
};
