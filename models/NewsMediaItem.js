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
  newsMediaGroupsInvolved: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'newsMediaGroup' }
  ],
  themeColor: {
    type: String
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

module.exports.NewsMediaItem = mongoose.model('', NewsMediaItemSchema);

module.exports.newsMediaItemResponseTypes = {
  // input validation
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',

  // db check
  NEWS_MEDIA_ITEM_NOT_EXISTS: 'NEWS_MEDIA_ITEM_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS',
  NEWS_MEDIA_ITEM_INVOLVED_IN_GROUPS: 'NEWS_MEDIA_ITEM_INVOLVED_IN_GROUPS'
};
