const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const fileUploadHandling = require('../../../middleware/fileUploadHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { formatDateString } = require('../../../utils/datetime');
const {
  Contact,
  contactResponseTypes,
  contactGroupArray
} = require('../../../models/Contact');
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
    const cleanStringFieldForCsv = str => {
      return str ? '"' + str.replace(/\"/g, '""') + '"' : '';
    };

    let contactsOutput =
      'emailAddress,name,language,isEnabled,lastModifyDT,lastModifyUser,' +
      contactGroupArray.join(',') +
      lineBreak;
    contacts.forEach(contact => {
      contactsOutput +=
        cleanStringFieldForCsv(contact.emailAddress) +
        csvDelimiter +
        cleanStringFieldForCsv(contact.name) +
        csvDelimiter +
        contact.language +
        csvDelimiter +
        contact.isEnabled.toString() +
        csvDelimiter +
        (contact.lastModifyDT ? formatDateString(contact.lastModifyDT) : '') +
        csvDelimiter +
        cleanStringFieldForCsv(lastModifyUser.name) +
        csvDelimiter +
        contactGroupArray
          .map(group => contact.groups.includes(group))
          .join(csvDelimiter) +
        lineBreak;
    });

    //console.log(contactsOutput);

    // https://medium.com/@aitchkhan/downloading-csv-files-from-express-server-7a3beb3ae52c
    const fileName = 'contacts-' + formatDateString(new Date()) + '.csv';
    const mimeType = 'text/csv';

    res.json({
      data: contactsOutput,
      fileName,
      mimeType
    });
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   POST api/backend/contacts/exportAndImport/import
// @desc    Get all contacts as csv
// @access  Private
router.post('/import', [auth, fileUploadHandling], async (req, res) => {
  if (
    !req.files ||
    Object.keys(req.files).length === 0 ||
    !req.files.fileImport
  ) {
    // 400 bad request
    return res.status(400).json({
      errors: [contactResponseTypes.NO_FILE_UPLOADED_OR_FILE_INVALID_FOR_IMPORT]
    });
  }

  console.log(req.files.fileImport);

  res.send('File uploaded');
});

module.exports = router;
