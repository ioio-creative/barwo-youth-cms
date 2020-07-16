const express = require('express');
const router = express.Router();
const config = require('config');
const em = config.get('Email.smtp');
const nodemailer = require('nodemailer');
const { check } = require('express-validator');

const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Newsletter } = require('../../../models/Newsletter');
const { Contact } = require('../../../models/Contact');
const {
  SendHistory,
  sendHistoryResponseTypes
} = require('../../../models/SendHistory');

/* utilities */
/* Contact */
const contactSelectForFindAll = {};
const contactPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

/* Newsletter */

const newsletterSelectForFindAll = {
  // eventsDirected: 0,
  // eventsPerformed: 0
};
const newsletterSelectForFindOne = { ...newsletterSelectForFindAll };

const newsletterPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

const newsletterPopulationListForFindOne = [
  ...newsletterPopulationListForFindAll
];

const sendHistoryValidationChecks = [
  check('title_tc', sendHistoryResponseTypes.TITLE_TC_REQUIRED).notEmpty(),
  check('title_sc', sendHistoryResponseTypes.TITLE_SC_REQUIRED).notEmpty(),
  check('title_en', sendHistoryResponseTypes.TITLE_EN_REQUIRED).notEmpty(),
  check('message_tc', sendHistoryResponseTypes.MESSAGE_TC_REQUIRED).notEmpty(),
  check('message_sc', sendHistoryResponseTypes.MESSAGE_SC_REQUIRED).notEmpty(),
  check('message_en', sendHistoryResponseTypes.MESSAGE_EN_REQUIRED).notEmpty()
];

const emailSend = async (contact, emailAddress, title, message) => {
  // console.log(emailAddress, title, message);
  let transporter = nodemailer.createTransport({
    host: 'email-smtp.ap-southeast-1.amazonaws.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: em.username, // generated ethereal user
      pass: em.password // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '<christopher.wong@ioiocreative.com>', // sender address
    to: emailAddress, // list of receivers
    subject: title, // Subject line
    html: message // html body
  });

  // console.log(info);
};

// @route   GET api/backend/newsletter/newsletter/:_id
// @desc    Get newsletter by id
// @access  Private
router.get('/:_id', auth, async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params._id)
      .select(newsletterSelectForFindOne)
      .populate(newsletterPopulationListForFindOne);
    if (!newsletter) {
      return res
        .status(404)
        .json({ errors: [sendHistoryResponseTypes.NEWSLETTER_NOT_EXISTS] });
    }
    res.json(newsletter);
  } catch (err) {
    console.error(err);
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [sendHistoryResponseTypes.NEWSLETTER_NOT_EXISTS] });
  }
});

// @route   POST api/backend/newsletters/sendHistory
// @desc    Add sendHistory
// @access  Private
router.post(
  '/',
  [auth, sendHistoryValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      title_tc,
      title_sc,
      title_en,
      message_tc,
      message_sc,
      message_en
    } = req.body;
    // console.log(req.body);
    let contacts = [];
    try {
      const options = {
        select: contactSelectForFindAll,
        populate: contactPopulationListForFindAll
      };
      let findOptions = {};

      // https://stackoverflow.com/questions/54360506/how-to-use-populate-with-mongoose-paginate-while-selecting-limited-values-from-p
      contacts = await Contact.paginate(findOptions, options);
    } catch (err) {}
    try {
      const sendHistory = new SendHistory({
        label,
        title_tc,
        title_sc,
        title_en,
        message_tc,
        message_sc,
        message_en
      });
      await Promise.all(
        contacts.docs.map(async contact => {
          if (contact.language === 'TC') {
            await emailSend(
              contact,
              contact.emailAddress,
              title_tc,
              message_tc
            );
          } else if (contact.language === 'SC') {
            await emailSend(
              contact,
              contact.emailAddress,
              title_sc,
              message_sc
            );
          } else {
            await emailSend(
              contact,
              contact.emailAddress,
              title_en,
              message_en
            );
          }
        })
      );

      await sendHistory.save();

      res.json(sendHistory);
    } catch (err) {
      generalErrorHandle(err, res);
    }
  }
);

module.exports = router;
