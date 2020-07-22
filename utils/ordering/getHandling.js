const { generalErrorHandle } = require('../errorHandling');

module.exports = async (
  res,
  Model,
  findParams = {},
  selectParams = {},
  sortParams = {}
) => {
  try {
    const itemsWithNullOrder = await Model.find({
      ...findParams,
      order: {
        $in: [null, undefined]
      }
    })
      .select(selectParams)
      .sort(sortParams);

    const itemsWithNonNullOrder = await Model.find({
      ...findParams,
      order: {
        $not: {
          $in: [null, undefined]
        }
      }
    })
      .select(selectParams)
      .sort(sortParams);

    res.json(itemsWithNonNullOrder.concat(itemsWithNullOrder));
  } catch (err) {
    generalErrorHandle(err, res);
  }
};
