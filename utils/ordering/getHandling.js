const { generalErrorHandle } = require('../errorHandling');

module.exports = async (
  res,
  Model,
  isResponseToClient = false,
  findParams = {},
  selectParams = {},
  sortParams = {},
  populateList = [],
  isFilterOutDisabled = true
) => {
  let itemsInOrder = [];

  const myFindParams = isFilterOutDisabled
    ? {
        isEnabled: {
          $ne: false
        },
        ...findParams
      }
    : findParams;
  const mySelectParams = {
    ...selectParams
  };
  const mySortParams = {
    order: 1,
    ...sortParams
  };
  const myPopulateList = [...populateList];

  try {
    const itemsWithNullOrder = await Model.find({
      ...myFindParams,
      order: {
        $in: [null, undefined]
      }
    })
      .select(mySelectParams)
      .populate(myPopulateList)
      .sort(mySortParams);

    const itemsWithNonNullOrder = await Model.find({
      ...myFindParams,
      order: {
        $not: {
          $in: [null, undefined]
        }
      }
    })
      .select(mySelectParams)
      .populate(myPopulateList)
      .sort(mySortParams);

    itemsInOrder = itemsWithNonNullOrder.concat(itemsWithNullOrder);
    if (isResponseToClient) {
      res.json(itemsInOrder);
    }
  } catch (err) {
    if (isResponseToClient) {
      generalErrorHandle(err, res);
    } else {
      throw err;
    }
  }

  return itemsInOrder;
};
