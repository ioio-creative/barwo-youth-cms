const express = require('express');
const router = express.Router();
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Contact } = require('../../../models/Contact');
const { Bounces } = require('../../../models/Bounces');

/* utilities */
/* Contact */
// const contactSelect = { emailAddress: 1, isEnable: 1 };

// @route   GET api/aws/sns/handle-bounces
// @desc    Update bounces
// @access  Private
router.get('/', [], async (req, res) => {
  const { bounce } = req.body;
  // console.log(req.body);
  // console.log(_id);

  try {
    let bounceInfo = [];
    bounceInfo = new Bounces({
      emailAddresses: bounce.bouncedRecipients.map(bouncedRecipient => {
        return bouncedRecipient.emailAddress;
      })
    });

    let contacts = [];
    // const options = { select: contactSelect };
    // let findOptions = {};

    // https://stackoverflow.com/questions/54360506/how-to-use-populate-with-mongoose-paginate-while-selecting-limited-values-from-p
    contacts = await Contact.find({});
    console.log(contacts);

    for (index in bounceInfo) {
      contacts.doc.findOneAndUpdate(
        { emailAddress: bounceInfo[index].emailAddress },
        { $set: (isEnabled = false) },
        { new: true }
      );
    }

    await bounceInfo.save();

    res.json(bounceInfo);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
