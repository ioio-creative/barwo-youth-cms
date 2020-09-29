const express = require('express');
const router = express.Router();
const config = require('config');
const em = config.get('Email.smtp');
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
const { Sender } = require('../../../models/Sender');
const {
  SendHistory,
  sendHistoryResponseTypes
} = require('../../../models/SendHistory');
const { languages } = require('../../../globals/languages');

/* utilities */

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

const getEmailFooter = contactId => {
  console.log(contactId);
  const barwoContactInfo =
    '<div style="color:#666;font-size:10pt;text-align:left;line-height:1.3em;border-top:2px solid #f071bf;margin-top:1.3em">' +
    '<br>' +
    '<table width="640" cellspacing="0" cellpadding="0" border="0">' +
    '<tbody>' +
    '<tr>' +
    '<td style="font-size:10pt;color:#666" colspan="2" width="50" valign="top">香港八和會館</td>' +
    '</tr>' +
    '<tr>' +
    '<td style="font-size:10pt;color:#666" width="50" valign="top">地址：</td>' +
    '<td style="font-size:10pt;color:#666" valign="top">香港油麻地彌敦道493號展望大廈4字樓A座</td></tr>' +
    '<tr>' +
    '<td style="font-size:10pt;color:#666" width="50" valign="top">電話：</td>' +
    '<td style="font-size:10pt;color:#666" valign="top">(852) 2384 2939</td>' +
    '</tr>' +
    '<tr>' +
    '<td style="font-size:10pt;color:#666" width="50" valign="top">傳真：</td>' +
    '<td style="font-size:10pt;color:#666" valign="top">(852) 2770 7956</td></tr>' +
    '<tr>' +
    '<td style="font-size:10pt;color:#666" width="50" valign="top">電郵：</td>' +
    '<td style="font-size:10pt;color:#666" valign="top"><a href="mailto:ymtinfo@hkbarwo.com" target="_blank">ymtinfo@hkbarwo.com</a></td>' +
    '</tr>' +
    '<tr>' +
    '<td style="font-size:10pt;color:#666" width="50" valign="top">網址：</td>' +
    '<td style="font-size:10pt;color:#666" valign="top"><a href="http://www.hkbarwoymt.com/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.hkbarwoymt.com/&amp;source=gmail&amp;ust=1601470342638000&amp;usg=AFQjCNFzBA-DIPl1lfmpXwLlVP7gXO6OQA">http://www.hkbarwoymt.com/</a></td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '</div>';
  const unsubscriptionMsg =
    '<div style="color:#666;font-size:8pt;text-align:left;line-height:1.3em">' +
    '<br>' +
    '如欲停止接收我們的最新電子消息，請<a href="http://www.hkbarwoymt.com/?a=unsubscribe&amp;email=christopher.wong@ioiocreative.com&amp;lang=tc" target="_blank">按此</a>。' +
    '<br>' +
    '</div>';
  return barwoContactInfo + unsubscriptionMsg;
};

const sendEmail = async (contact, emailAddress, name, title, message) => {
  const transporter = nodemailer.createTransport({
    host: 'email-smtp.ap-southeast-1.amazonaws.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: em.username, // generated ethereal user
      pass: em.password // generated ethereal password
    }
  });
  // send mail with defined transport object
  const sendEmailInfo = await transporter.sendMail({
    from: `"${name}" ${emailAddress}`, // sender address
    to: contact.emailAddress, // Receivers
    subject: title, // Subject line
    //html: message // html body
    html: '<div>' + message + '<br>' + getEmailFooter(contact._id) + '</div>' // html body
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

    console.log(newsletterId);

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

    // if groupsArray.length === 0 => no picked group => send to all
    const groupsArray = groups.map(group => {
      return group._id;
    });

    try {
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
          .filter(
            contact =>
              contact.isEnabled !== false &&
              (groupsArray.some(r => contact.groups.includes(r)) ||
                groupsArray.length === 0)
          )
          .map(async contact => {
            // console.log(contact);

            if (contact.language === languages.TC._id) {
              return await sendEmail(
                contact,
                sender.emailAddress,
                sender.name_tc,
                title_tc,
                message_tc
              );
            } else if (contact.language === languages.SC._id) {
              return await sendEmail(
                contact,
                sender.emailAddress,
                sender.name_sc,
                title_sc,
                message_sc
              );
            } else if (contact.language === languages.EN._id) {
              return await sendEmail(
                contact,
                sender.emailAddress,
                sender.name_en,
                title_en,
                message_en
              );
            }
            return null;
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
