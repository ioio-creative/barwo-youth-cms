const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { formatDateString } = require('../../../utils/datetime');
const { Contact } = require('../../../models/Contact');
const { lastModifyUser } = require('../common/mediumSelect');

/* utilities */

const contactSelectForFindAll = {};

const contactPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

/* end of utilities */

// @route   GET api/backend/contacts/exportAndImport/export
// @desc    Get all contacts as csv
// @access  Private
router.get('/export', [auth], async (req, res) => {
  try {
    let findOptions = {};
    // const filterTextRegex = req.filterTextRegex;
    // if (filterTextRegex) {
    //   // https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly
    //   findOptions = {
    //     ...findOptions,
    //     $or: [{ emailAddress: filterTextRegex }, { name: filterTextRegex }]
    //   };
    // }

    const contacts = await Contact.find(findOptions)
      .select(contactSelectForFindAll)
      .populate(contactPopulationListForFindAll);

    // https://stackabuse.com/reading-and-writing-csv-files-with-node-js/
    // https://gist.github.com/nulltask/2056783
    const csvDelimiter = ',';
    const lineBreak = '\r\n';
    const contactGroupDelimiter = '-';
    const cleanStringFieldForCsv = str => {
      return str ? '"' + str.replace(/\"/g, '""') + '"' : '';
    };

    let contactsOutput =
      'emailAddress,name,groups,language,isEnabled,lastModifyDT,lastModifyUser';
    contacts.forEach(contact => {
      contactsOutput +=
        cleanStringFieldForCsv(contact.emailAddress) +
        csvDelimiter +
        cleanStringFieldForCsv(contact.name) +
        csvDelimiter +
        contact.groups.join(contactGroupDelimiter) +
        csvDelimiter +
        contact.language +
        csvDelimiter +
        contact.isEnabled.toString() +
        csvDelimiter +
        (contact.lastModifyDT ? formatDateString(contact.lastModifyDT) : '') +
        csvDelimiter +
        cleanStringFieldForCsv(lastModifyUser.name) +
        lineBreak;
    });

    console.log(contactsOutput);

    res.header('Content-Type', 'text/csv');
    // https://medium.com/@aitchkhan/downloading-csv-files-from-express-server-7a3beb3ae52c
    const fileName = 'contacts-' + formatDateString(new Date()) + '.csv';
    res.attachment(fileName);
    res.send(contactsOutput);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

module.exports = router;
