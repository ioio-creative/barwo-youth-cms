const express = require('express');
const router = express.Router();
const config = require('config');
const nodemailer = require('nodemailer');
const objectID = require('mongodb').ObjectId;
const { check } = require('express-validator');
const listingHandling = require('../../../middleware/listingHandling');
const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { newsletterResponseTypes } = require('../../../models/Newsletter');
const { Contact } = require('../../../models/Contact');
const { MiscellaneousInfo } = require('../../../models/MiscellaneousInfo');
const { Sender } = require('../../../models/Sender');
const {
  SendHistory,
  sendHistoryResponseTypes
} = require('../../../models/SendHistory');
const {
  languages,
  defaultLanguage,
  getLanguageById,
  getEntityPropByLanguage
} = require('../../../globals/languages');

/* constants */

/* end of constants */

/* utilities */

const miscellaneousInfoSelect = {
  contactAddress_tc: 1,
  contactAddress_sc: 1,
  contactAddress_en: 1,
  contactTel: 1,
  contactFax: 1,
  contactEmail: 1
};

const senderSelect = {};
const senderPopulationList = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

const newsletterValidationChecks = [
  check('label', newsletterResponseTypes.LABEL_REQUIRED).notEmpty(),
  check('title_tc', newsletterResponseTypes.TITLE_TC_REQUIRED).notEmpty(),
  check('title_sc', newsletterResponseTypes.TITLE_SC_REQUIRED).notEmpty(),
  check('title_en', newsletterResponseTypes.TITLE_EN_REQUIRED).notEmpty(),
  check('message_tc', newsletterResponseTypes.MESSAGE_TC_REQUIRED).notEmpty(),
  check('message_sc', newsletterResponseTypes.MESSAGE_SC_REQUIRED).notEmpty(),
  check('message_en', newsletterResponseTypes.MESSAGE_EN_REQUIRED).notEmpty()
];

const sendHistorySelectForFindAll = {};
const sendHistorySelectForFindOne = { ...sendHistorySelectForFindAll };

const sendHistoryPopulationListForFindAll = [
  {
    path: 'sender',
    select: 'name'
  }
];
const sendHistoryPopulationListForFindOne = [
  ...sendHistoryPopulationListForFindAll
];

// TODO: this is hard-coded...
const emailFooterMetasByLanguage = {
  TC: {
    _id: 'TC',
    companyName: '香港八和會館',
    contactAddressLabel: '地址：',
    contactPhoneLabel: '電話：',
    contactFaxLabel: '傳真：',
    contactEmailLabel: '電郵：',
    contactEmailAddress: 'ymtinfo@hkbarwo.com',
    contactWebsiteLabel: '網址：',
    unsubscriptionMsg1: '如欲停止接收我們的最新電子消息，請',
    unsubscriptionMsg2: '按此',
    unsubscriptionMsg3: '。'
  },
  SC: {
    _id: 'SC',
    companyName: '香港八和会馆',
    contactAddressLabel: '地址：',
    contactPhoneLabel: '电话：',
    contactFaxLabel: '传真：',
    contactEmailLabel: '电邮：',
    contactEmailAddress: 'ymtinfo@hkbarwo.com',
    contactWebsiteLabel: '网址：',
    unsubscriptionMsg1: '如欲停止接收我们的最新电子消息，请',
    unsubscriptionMsg2: '按此',
    unsubscriptionMsg3: '。'
  },
  EN: {
    _id: 'EN',
    companyName: 'The Chinese Artists Association of Hong Kong',
    contactAddressLabel: 'Address:',
    contactPhoneLabel: 'Phone:',
    contactFaxLabel: 'Fax:',
    contactEmailLabel: 'Email:',
    contactEmailAddress: 'ymtinfo@hkbarwo.com',
    contactWebsiteLabel: 'Website:',
    unsubscriptionMsg1:
      'If you want to stop receiving our e-newsletters, please ',
    unsubscriptionMsg2: 'unsubscribe',
    unsubscriptionMsg3: '.'
  }
};

const emailFooterMetasByLanguageArray = Object.values(
  emailFooterMetasByLanguage
);

const getEmailFooterMeta = (langId = defaultLanguage._id) => {
  const langIdCleaned = langId.toUpperCase();
  return emailFooterMetasByLanguageArray.find(emailFooterMeta => {
    return emailFooterMeta._id === langIdCleaned;
  });
};

const getEmailFooter = (contact, miscellaneousInfo, websiteFrontendRoot) => {
  const contactLangId = contact.language;
  const contactLangObj = getLanguageById(contactLangId);
  const emailFooterMeta = getEmailFooterMeta(contactLangId);

  const barwoContactInfo =
    '<div style="color:#666;font-size:10pt;text-align:left;line-height:1.3em;border-top:2px solid #f071bf;margin-top:1.3em">' +
    '<br>' +
    '<table width="640" cellspacing="0" cellpadding="0" border="0">' +
    '<tbody>' +
    '<tr>' +
    `<td style="font-size:10pt;color:#666" colspan="2" width="75" valign="top">${emailFooterMeta.companyName}</td>` +
    '</tr>' +
    '<tr>' +
    `<td style="font-size:10pt;color:#666" width="75" valign="top">${emailFooterMeta.contactAddressLabel}</td>` +
    `<td style="font-size:10pt;color:#666" valign="top">${getEntityPropByLanguage(
      miscellaneousInfo,
      'contactAddress',
      contactLangObj
    )}</td></tr>` +
    '<tr>' +
    `<td style="font-size:10pt;color:#666" width="75" valign="top">${emailFooterMeta.contactPhoneLabel}</td>` +
    `<td style="font-size:10pt;color:#666" valign="top">${miscellaneousInfo.contactTel}</td>` +
    '</tr>' +
    '<tr>' +
    `<td style="font-size:10pt;color:#666" width="75" valign="top">${emailFooterMeta.contactFaxLabel}</td>` +
    `<td style="font-size:10pt;color:#666" valign="top">${miscellaneousInfo.contactFax}</td></tr>` +
    '<tr>' +
    `<td style="font-size:10pt;color:#666" width="75" valign="top">${emailFooterMeta.contactEmailLabel}</td>` +
    `<td style="font-size:10pt;color:#666" valign="top"><a href="mailto:${emailFooterMeta.contactEmailAddress}" target="_blank" rel="noopener noreferrer">${emailFooterMeta.contactEmailAddress}</a></td>` +
    '</tr>' +
    '<tr>' +
    `<td style="font-size:10pt;color:#666" width="75" valign="top">${emailFooterMeta.contactWebsiteLabel}</td>` +
    `<td style="font-size:10pt;color:#666" valign="top"><a href="${websiteFrontendRoot}" target="_blank" rel="noopener noreferrer">${websiteFrontendRoot}</a></td>` +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '</div>';

  const unsubscriptionMsg =
    '<div style="color:#666;font-size:8pt;text-align:left;line-height:1.3em">' +
    '<br>' +
    `${emailFooterMeta.unsubscriptionMsg1}<a href="${websiteFrontendRoot}?status=unsubscribe&amp;contactId=${contact._id}&amp;lang=${contactLangObj.routeParam}" target="_blank" rel="noopener noreferrer">${emailFooterMeta.unsubscriptionMsg2}</a>${emailFooterMeta.unsubscriptionMsg3}` +
    '<br>' +
    '</div>';

  return barwoContactInfo + unsubscriptionMsg;
};

const sendEmail = async (
  smtpCredentials,
  websiteFrontendRoot,
  miscellaneousInfo,
  contact,
  emailAddress,
  name,
  title,
  message
) => {
  const transporter = nodemailer.createTransport({
    host: 'email-smtp.ap-southeast-1.amazonaws.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpCredentials.username, // generated ethereal user
      pass: smtpCredentials.password // generated ethereal password
    }
  });
  // send mail with defined transport object
  const sendEmailInfo = await transporter.sendMail({
    from: `"${name}" ${emailAddress}`, // sender address
    to: contact.emailAddress, // Receivers
    subject: title, // Subject line
    //html: message // html body
    html:
      '<div>' +
      message +
      '<br>' +
      getEmailFooter(contact, miscellaneousInfo, websiteFrontendRoot) +
      '</div>' // html body
  });
  console.log('sendHistory sendEmail info:', sendEmailInfo);
};

// @route   POST api/backend/newsletters/sendHistory
// @desc    Add sendHistory
// @access  Private
router.post(
  '/',
  [auth, newsletterValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      groups,
      title_tc,
      title_sc,
      title_en,
      message_tc,
      message_sc,
      message_en,
      _id: newsletterId
    } = req.body;

    /* config */

    const smtpCredentials = config.get('Email.smtp');
    const websiteFrontendRoot = config.get('WebsiteFrontend.root');

    /* end of config */

    let contacts = [];
    try {
      // https://stackoverflow.com/questions/54360506/how-to-use-populate-with-mongoose-paginate-while-selecting-limited-values-from-p
      contacts = await Contact.find({});
    } catch (err) {
      // TODO:
      console.error(err);
    }

    let sender = {};
    try {
      sender = await Sender.findOne({})
        .select(senderSelect)
        .populate(senderPopulationList);
    } catch (err) {
      // TODO:
      console.error(err);
    }

    const groupsArray = groups.map(group => {
      return group._id;
    });

    try {
      const miscellaneousInfo = await MiscellaneousInfo.findOne({}).select(
        miscellaneousInfoSelect
      );

      const sendHistory = new SendHistory({
        label: label.trim(),
        recipients: groupsArray,
        title_tc,
        title_sc,
        title_en,
        message_tc,
        message_sc,
        message_en,
        email: newsletterId,
        sender: req.user._id
      });

      await Promise.all(
        getArraySafe(contacts)
          // if groupsArray.length === 0 => no picked group => send to all
          .filter(
            contact =>
              contact.isEnabled !== false &&
              (groupsArray.some(r => contact.groups.includes(r)) ||
                groupsArray.length === 0)
          )
          .map(async contact => {
            let senderName = sender.name_tc;
            let title = title_tc;
            let message = message_tc;

            const contactLanguageId = contact.language.toUpperCase();

            if (contactLanguageId === languages.TC._id) {
              senderName = sender.name_tc;
              title = title_tc;
              message = message_tc;
            } else if (contactLanguageId === languages.SC._id) {
              senderName = sender.name_sc;
              title = title_sc;
              message = message_sc;
            } else if (contactLanguageId === languages.EN._id) {
              senderName = sender.name_en;
              title = title_en;
              message = message_en;
            }

            return await sendEmail(
              smtpCredentials,
              websiteFrontendRoot,
              miscellaneousInfo,
              contact,
              sender.emailAddress,
              senderName,
              title,
              message
            );
          })
      );

      await sendHistory.save();

      res.json(sendHistory);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

// @desc    Get sendHistories
// @access  Private
router.get('/', [auth, listingHandling], async (req, res) => {
  try {
    const options = {
      ...req.paginationOptions,
      select: sendHistorySelectForFindAll,
      populate: sendHistoryPopulationListForFindAll
    };

    let findOptions = {};
    const filterTextRegex = req.filterTextRegex;
    if (filterTextRegex) {
      // https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly
      findOptions = {
        ...findOptions,
        $or: [
          { label: filterTextRegex },
          { title_tc: filterTextRegex },
          { title_sc: filterTextRegex },
          { title_en: filterTextRegex }
        ]
      };
    }

    var hex = /[0-9A-Fa-f]{24}/g;
    if (hex.test(req.query.filterText)) {
      findOptions['$or'].push(
        { sender: objectID(req.query.filterText) },
        { email: objectID(req.query.filterText) }
      );
    }

    // https://stackoverflow.com/questions/54360506/how-to-use-populate-with-mongoose-paginate-while-selecting-limited-values-from-p
    const sendHistories = await SendHistory.paginate(findOptions, options);
    res.json(sendHistories);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @desc    Get sendHistory by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const sendHistory = await SendHistory.findById(req.params._id)
      .select(sendHistorySelectForFindOne)
      .populate(sendHistoryPopulationListForFindOne);
    // console.log(sendHistory);
    if (!sendHistory) {
      return res
        .status(404)
        .json({ errors: [sendHistoryResponseTypes.SENDHISTORY_NOT_EXISTS] });
    }
    res.json(sendHistory);
  } catch (err) {
    // console.log('error');
    console.error(err);
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [sendHistoryResponseTypes.SENDHISTORY_NOT_EXISTS] });
  }
});

module.exports = router;
