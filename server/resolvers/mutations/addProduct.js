const Products = require('../../models/product.model');
const Suppliers = require('../../models/supplier.model');
const Parrots = require('../../models/parrot.model');

const addProduct = async (obj, args, ctx) => {
  const { qty, parrotCode, price, avatar } = args.input;

  const supplierId = await Suppliers.findOne(
    {
      code: 'australia_macaws'
    },
    '_id code'
  );

  const { _id: parrotId } = await Parrots.findOne({
    code: parrotCode
  });

  const product = new Products({
    parrot: parrotId,
    supplier: supplierId,
    avatar,
    price,
    qty,
    sku: parrotCode,
    createdBy: ctx.user.sub
  });

  return product.save();
};

module.exports = addProduct;
