const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { PageMetaSchema } = require('./PageMeta');

const NewsSchema = mongoose.Schema({
  label: {
    type: String,
    require: true,
    unique: true
  },
  // order: {
  //   type: Number
  // },
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
  //category: [String],
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
  /* media */
  featuredImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medium'
  },
  // downloadName_tc: {
  //   type: String
  // },
  // downloadName_sc: {
  //   type: String
  // },
  // downloadName_en: {
  //   type: String
  // },
  // downloadType: {
  //   type: String
  // },
  // downloadUrl_tc: {
  //   type: String
  // },
  // downloadUrl_sc: {
  //   type: String
  // },
  // downloadUrl_en: {
  //   type: String
  // },
  // downloadMedium: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'medium'
  // },
  /* end of media */
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

NewsSchema.plugin(mongoosePaginate);

module.exports.News = mongoose.model('news', NewsSchema);

const newsTypes = {
  SPECIAL_NOTICE: 'SPECIAL_NOTICE',
  PRESS_RELEASE: 'PRESS_RELEASE',
  INTERVIEW: 'INTERVIEW'
};

const newsTypesArray = Object.values(newsTypes);

module.exports.newsTypes = newsTypes;

module.exports.newsTypesArray = newsTypesArray;

module.exports.isValidNewsType = type => {
  return newsTypesArray.includes(type);
};

module.exports.newsResponseTypes = {
  // input validation
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  NAME_TC_REQUIRED: 'NAME_TC_REQUIRED',
  NAME_SC_REQUIRED: 'NAME_SC_REQUIRED',
  NAME_EN_REQUIRED: 'NAME_EN_REQUIRED',
  TYPE_REQUIRED: 'TYPE_REQUIRED',
  TYPE_INVALID: 'TYPE_INVALID',
  FROM_DATE_REQUIRED: 'FROM_DATE_REQUIRED',

  // db check
  NEWS_NOT_EXISTS: 'NEWS_NOT_EXISTS',
  LABEL_ALREADY_EXISTS: 'LABEL_ALREADY_EXISTS',
  NEWS_DELETED: 'NEWS_DELETED'
};
