const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const NewsSchema = mongoose.Schema({
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
  //category: [String],
  desc_tc: {
    type: String
  },
  desc_sc: {
    type: String
  },
  desc_en: {
    type: String
  },
  /* media */
  featuredImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  downloadName_tc: {
    type: String
  },
  downloadName_sc: {
    type: String
  },
  downloadName_en: {
    type: String
  },
  downloadType: {
    type: String
  },
  downloadUrl_tc: {
    type: String
  },
  downloadUrl_sc: {
    type: String
  },
  downloadUrl_en: {
    type: String
  },
  downloadMedium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  /* end of media */
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

NewsSchema.plugin(mongoosePaginate);

module.exports.News = mongoose.model('news', NewsSchema);

module.exports.newsResponseTypes = {
  // input validation
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',

  // db check
  NEWS_NOT_EXISTS: 'NEWS_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS'
};
