const mongoose = require('mongoose');

let root = '../server';

if (process.env.NODE_ENV === 'production') {
  root = '../build';
}

const connect = require(`${root}/db/conn`);
const Parrots = require(`${root}/models/parrot.model`);
const Suppliers = require(`${root}/models/supplier.model`);
const Products = require(`${root}/models/product.model`);

const parrots = require('./seeds/parrots.json');
const suppliers = require('./seeds/suppliers.json');
const products = require('./seeds/products.json');

// IIFE
(async () => {
  connect();

  await mongoose.connection.collections.suppliers.drop();
  await mongoose.connection.collections.parrots.drop();
  await mongoose.connection.collections.products.drop();

  const syncedParrots = await Parrots.insertMany(parrots);

  const suppliersToSync = suppliers.map(s => ({
    ...s,
    parrots: s.parrots.map(p => syncedParrots.find(x => x.code === p)._id)
  }));

  const syncedSuppliers = await Suppliers.insertMany(suppliersToSync);

  const productsToSync = products.map(p => ({
    ...p,
    parrot: syncedParrots.find(x => x.code === p.parrot)._id,
    supplier: syncedSuppliers.find(x => x.code === p.supplier)._id
  }));

  await Products.insertMany(productsToSync);

  process.exit();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
