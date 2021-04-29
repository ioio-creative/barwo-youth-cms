const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const fileUploadHandling = require('../../../middleware/fileUploadHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { formatDateString } = require('../../../utils/datetime');
const { extnameWithDot } = require('../../../utils/fileSystem');
const {
  Contact,
  contactResponseTypes,
  contactGroupArray
} = require('../../../models/Contact');
const { lastModifyUser } = require('../common/mediumSelect');

/* utilities */

const csvExtensionWithDot = '.csv';
const csvMimeType = 'text/csv';
const csvExportMimeType = 'text/csv; charset=utf-8';
const csvAllowedMimeTypes = [csvMimeType, 'application/vnd.ms-excel'];

const isValidCsvFileImport = fileImport => {
  return (
    extnameWithDot(fileImport.name) === csvExtensionWithDot &&
    csvAllowedMimeTypes.includes(fileImport.mimetype)
  );
};

const contactSelectForFindAll = {};

const contactPopulationListForFindAll = [
  {
    path: 'lastModifyUser',
    select: 'name'
  }
];

// this char is necessary for excel display chinese correctly
const universalBOM = "\uFEFF";
// const universalBOM = "";
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
      universalBOM +
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
    const fileName =
      'contacts-' + formatDateString(new Date()) + csvExtensionWithDot;
    const mimeType = csvExportMimeType;

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
  const reqFiles = req.files;
  if (
    !reqFiles ||
    Object.keys(reqFiles).length === 0 ||
    !reqFiles.fileImport ||
    !isValidCsvFileImport(reqFiles.fileImport)
  ) {
    // 400 bad request
    return res.status(400).json({
      errors: [contactResponseTypes.NO_FILE_UPLOADED_OR_FILE_INVALID_FOR_IMPORT]
    });
  }

  const fileImport = req.files.fileImport;
  // console.log(req.files);

  const csvData = fileImport.data;
  const csvStr = csvData.toString();
  const csvArray = csvStr.split(/\r\n|\n\r|\n|\r/g);

  const groupString = [
    'MEDIA','EDM','YMT','BARWO','PRIMANY','SECONDARY','UNIVERSITY','FAMILY'
  ];
  // start import process
  // delete all existing records
  // Contact.deleteMany({});
  // loop through all records to insert
  // /*
  // let totalRecords = 0;
  // let importedRecords = 0;
  const allImports = csvArray.map((csvRow, idx) => {
    return new Promise((resolve, reject) => {
      if (idx === 0 && (csvRow[0] === universalBOM || csvRow[0] === "e" || csvRow.trim().length === 0)) {
        resolve(0);
      } else {
        const record = csvRow.split(csvDelimiter);
        if (record.length === 14) {
          // malform data, skip it
          continue;
        } else {
          const groupArray = [];
          for (let i = 6; i < record.length; i++) {
            if (String(record[3]).toLowerCase() === 'true') {
              groupArray.push(groupString[i - 6]);
            }
          }
          // try {
            const contact = new Contact({
              emailAddress: record[0],
              name: record[1],
              // type,
              groups: groupArray,
              language: record[2],
              isEnabled: String(record[3]).toLowerCase() === 'true',
              // lastModifyUser: req.user._id
            });
            contact.save().then(_ => {
              resolve(1);
            }).catch(_ => {
              resolve(0);
            });
            // maybe promise is a better solution?
            // await contact.save();
        
            // res.json(contact);
          // } catch (err) {
          //   resolve(0);
          //   // if (!handleContactLabelDuplicateKeyError(err, res)) {
          //   //   generalErrorHandle(err, res);
          //   // }
          // }
        }
      }
    })
  })
  Promise.all(allImports).then(resultArray => {
    const recordInserted = resultArray.reduce((accumulate, current) => accumulate + current, 0);
    res.send(`${recordInserted} records imported.`);
  })
  // for (let i = 0; i < csvArray.length; i++) {
  //   if (i === 0 && (csvArray[i][0] === universalBOM || csvArray[i][0] === "e" || csvArray[i].trim().length === 0)) {
  //     // should be header row or empty row
  //     continue;
  //   } else {
  //     // should be record
  //     totalRecords++;
  //     const record = csvArray[i].split(csvDelimiter);
  //     if (record.length === 14) {
  //       // malform data, skip it
  //       continue;
  //     } else {
  //       const groupArray = [];
  
  //       try {
  //         const contact = new Contact({
  //           emailAddress: record[0],
  //           name: record[1],
  //           // type,
  //           groups: groupArray,
  //           language: record[2],
  //           isEnabled: String(record[3]).toLowerCase() === 'true',
  //           // lastModifyUser: req.user._id
  //         });
  
  //         // maybe promise is a better solution?
  //         // await contact.save();
      
  //         // res.json(contact);
  //       } catch (err) {
  //         if (!handleContactLabelDuplicateKeyError(err, res)) {
  //           generalErrorHandle(err, res);
  //         }
  //       }
  //     }
  //   }
  // }
  
  
  
  // */


  // res.send('File uploaded');
  // res.status(200).json({"data": csvStr});
});

module.exports = router;
