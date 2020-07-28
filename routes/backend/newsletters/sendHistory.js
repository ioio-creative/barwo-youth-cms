const express = require('express');
const router = express.Router();
const config = require('config');
const em = config.get('Email.smtp');
const nodemailer = require('nodemailer');
const { check } = require('express-validator');
const listingHandling = require('../../../middleware/listingHandling');
const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const {
  Newsletter,
  newsletterResponseTypes
} = require('../../../models/Newsletter');
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

const emailSend = async (contact, title, message) => {
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
  await transporter.sendMail({
    from: '<christopher.wong@ioiocreative.com>', // sender address
    to: contact.emailAddress, // Receivers
    subject: title, // Subject line
    html: `${message}<br/><p>Yours sincerely,</p> <p>Barwo</p>` // html body
  });
  // console.log(info);
};

// const setSendHistoryInvolvedForNewsletter = async (
//   sendHistoryId,
//   newsletter,
//   session
// ) => {
//   // https://stackoverflow.com/questions/55264112/mongoose-many-to-many-relations

//   const options = { session };
//   // set newsletter's newsletterSended
//   // artist.artist is artist's _id
//   newsletter = await Newsletter.findByIdAndUpdate(
//     newsletter.newsletter,
//     {
//       $addToSet: {
//         newsletterSended: sendHistoryId
//       }
//     },
//     options
//   );
// };

// @route   POST api/backend/newsletters/sendHistory
// @desc    Add sendHistory
// @access  Private
router.post(
  '/',
  [auth, newsletterValidationChecks, validationHandling],
  async (req, res) => {
    const {
      label,
      title_tc,
      title_sc,
      title_en,
      message_tc,
      message_sc,
      message_en,
      _id
    } = req.body;
    // console.log(req.body);
    console.log(_id);
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
        message_en,
        email: _id,
        sender: req.user._id
      });

      // await Promise.all(
      //   contacts.docs.map(async contact => {
      //     if (contact.language === 'TC') {
      //       await emailSend(contact, title_tc, message_tc);
      //     } else if (contact.language === 'SC') {
      //       await emailSend(contact, title_sc, message_sc);
      //     } else {
      //       await emailSend(contact, title_en, message_en);
      //     }
      //   })
      // );

      await sendHistory.save();
      // setSendHistoryInvolvedForNewsletter(sendHistory._id, newsletter);

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
    // console.error(err);
    //generalErrorHandle(err, res);
    return res
      .status(404)
      .json({ errors: [sendHistoryResponseTypes.SENDHISTORY_NOT_EXISTS] });
  }
});

module.exports = router;
