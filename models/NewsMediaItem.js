const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { PageMetaSchema } = require('./PageMeta');

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
  type: {
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
  thumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'medium' }],
  videoLinks: [
    {
      type: String,
      require: true
    }
  ],
  pageMeta: PageMetaSchema,
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

const newsMediaItemTypes = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO'
};

const newsMediaItemTypesArray = Object.values(newsMediaItemTypes);

module.exports.newsMediaItemTypes = newsMediaItemTypes;

module.exports.defaultNewsMediaItemType = newsMediaItemTypes.IMAGE;

module.exports.isValidNewsMediaItemType = type => {
  return newsMediaItemTypesArray.includes(type && type.toUpperCase());
};

module.exports.newsMediaItemResponseTypes = {
  // input validation
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',
  TYPE_REQUIRED: 'TYPE_REQUIRED',
  FROM_DATE_REQUIRED: 'FROM_DATE_REQUIRED',
  VIDEO_LINK_REQUIRED: 'VIDEO_LINK_REQUIRED',

  // db check
  NEWS_MEDIA_ITEM_NOT_EXISTS: 'NEWS_MEDIA_ITEM_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS'
};
