const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const NewsMediaItemSchema = mongoose.Schema({
  label: {
    type: String,
    require: true,
    unique: true
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
  fromDate: {
    type: Date,
    require: true
  },
  desc_tc: {
    type: String
  },
  desc_sc: {
    type: String
  },
  desc_en: {
    type: String
  },
  gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'medium' }],
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

NewsMediaItemSchema.plugin(mongoosePaginate);

module.exports.NewsMediaItem = mongoose.model(
  'newsMediaItem',
  NewsMediaItemSchema
);

module.exports.newsMediaItemResponseTypes = {
  // input validation
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',
  FROM_DATE_REQUIRED: 'FROM_DATE_REQUIRED',

  // db check
  NEWS_MEDIA_ITEM_NOT_EXISTS: 'NEWS_MEDIA_ITEM_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS'
};
