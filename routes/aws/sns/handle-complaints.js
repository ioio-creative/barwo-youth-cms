const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const validationHandling = require('../../../middleware/validationHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Contact } = require('../../../models/Contact');
const { Complaints } = require('../../../models/Complaints.js');

/* utilities */
/* Contact */
const contactSelect = { emailAddress: 1, isEnable: 1 };

// @route   POST api/aws/sns/handle-complaints
// @desc    Add complaints
// @access  Private
router.post('/', [auth, validationHandling], async (req, res) => {
  const { complaint } = req.body;
  // console.log(req.body);
  // console.log(_id);

  try {
    let contacts = [];
    try {
      const options = { select: contactSelect };

      let findOptions = {};

      // https://stackoverflow.com/questions/54360506/how-to-use-populate-with-mongoose-paginate-while-selecting-limited-values-from-p
      contacts = await Contact.paginate(findOptions, options);
      // console.log(contacts);
    } catch (err) {}

    let complaintInfo = [];
    try {
      complaintInfo = new Complaints({
        emailAddresses: complaint.complaintdRecipients.map(
          complaintdRecipient => {
            return complaintdRecipient.emailAddress;
          }
        )
      });
    } catch (err) {}

    for (index in complaintInfo) {
      contacts.doc.findOneAndUpdate(
        { emailAddress: complaintInfo[index].emailAddress },
        { $set: (isEnabled = false) },
        { new: true }
      );
    }

    await complaintInfo.save();

    res.json(complaintInfo);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
