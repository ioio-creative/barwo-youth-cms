const mongoose = require('mongoose');

const { getArraySafe } = require('../js/array/isNonEmptyArray');
const { generalErrorHandle } = require('../errorHandling');

module.exports = async (res, items, Model, isResponseToClient = false) => {
  const safeItems = getArraySafe(items);

  if (safeItems.length === 0) {
    if (isResponseToClient) {
      res.sendStatus(200);
    }
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

    if (isResponseToClient) {
      res.sendStatus(200);
    }
  } catch (err) {
    await session.abortTransaction();
    if (isResponseToClient) {
      generalErrorHandle(err, res);
    } else {
      throw err;
    }
  }
};
