const express = require('express');
const router = express.Router();

const auth = require('../../../middleware/auth');
const postOrderingHandling = require('../../../utils/ordering/postHandling');
const { generalErrorHandle } = require('../../../utils/errorHandling');
const { Contact, contactGroups } = require('../../../models/Contact');

/* utilities */

const groupFind = {
  // https://stackoverflow.com/questions/45842338/mongoose-error-cant-use-or-with-string
  type: {
    $in: [contactGroups]
    // $in: contactGroups
  }
};

const groupSelect = {
  label: 1
};

const groupSort = {
  label: 1
};

/* end of utilities */

// @route   GET api/backend/contacts/groups
// @desc    Get all Groups
// @access  Private

router.get('/', auth, async (req, res) => {
  try {
    // const groups = await Contact.find(groupFind);
    // res.json(groups);
    res.json([
      { value: 'MEDIA', _id: 'MEDIA', label: 'Media/Press' },
      { value: 'EDM', _id: 'EDM', label: 'EDM Subscribers' },
      { value: 'YMT', _id: 'YMT', label: 'Committee (YMT)' },
      { value: 'BARWO', _id: 'BARWO', label: 'Committee (BARWO)' },
      { value: 'PRIMANY', _id: 'PRIMANY', label: 'Primary School' },
      {
        value: 'SECONDARY',
        _id: 'SECONDARY',
        label: 'Secondary School'
      },
      { value: 'UNIVERSITY', _id: 'UNIVERSITY', label: 'University' },
      { value: 'FAMILY', _id: 'FAMILY', label: 'Family' }
    ]);
    // console.log(groups);
  } catch (err) {
    generalErrorHandle(err, res);
  }
});

// @route   GET api/backend/contacts/groups/groupsInOrder
// @desc    Get all groups in order
// @access  Private

router.get('/groupsInOrder', auth, async (req, res) => {
  await getOrderingHandling(
    res,
    Contact,
    true,
    groupFind,
    groupSelect,
    groupSort,
    [],
    true // not allow disabled groups
  );
});

// @route   POST api/backend/contacts/groups/groupsInOrder
// @desc    Update all groups' order
// @access  Private
router.post('/groupsInOrder', auth, async (req, res) => {
  const { groups } = req.body;
  await postOrderingHandling(res, groups, Contact, true);
});

module.exports = router;
