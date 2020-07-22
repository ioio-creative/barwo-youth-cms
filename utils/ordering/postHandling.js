const mongoose = require('mongoose');

const { getArraySafe } = require('../js/array/isNonEmptyArray');
const { generalErrorHandle } = require('../errorHandling');

module.exports = async (res, items, Model) => {
  const safeItems = getArraySafe(items);

  if (safeItems.length === 0) {
    res.sendStatus(200);
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (let i = 0; i < safeItems.length; i++) {
      const item = safeItems[i];
      await Model.findByIdAndUpdate(
        item._id,
        {
          $set: { order: i }
        },
        { session, new: true }
      );
    }

    await session.commitTransaction();

    res.sendStatus(200);
  } catch (err) {
    await session.abortTransaction();
    generalErrorHandle(err, res);
  }
};
