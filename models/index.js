const sequelize = require('../config/db');
const user = require('./user');
const product = require('./product');
const transaction = require('./transaction');
const transactionItem = require('./transactionItem');

// Relasi
user.hasMany(transaction, { foreignKey: 'user_id' });
transaction.belongsTo(user, { foreignKey: 'user_id' });

transaction.hasMany(transactionItem, {
  foreignKey: 'transaction_id',
  as: 'transactionItems'
});
transactionItem.belongsTo(transaction, {
  foreignKey: 'transaction_id',
  as: 'transaction'
});

product.hasMany(transactionItem, {
  foreignKey: 'product_id',
  as: 'productItems'
});
transactionItem.belongsTo(product, {
  foreignKey: 'product_id',
  as: 'product'
});

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // HATI-HATI: force true akan drop tabel
    console.log('✅ Database synced');
    // Buat admin jika belum ada
    const adminExists = await user.findOne({ where: { email: 'admin@minimarket.com' } });
    if (!adminExists) {
      await user.create({
        name: 'Admin Utama',
        email: 'admin@minimarket.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin created');
    }
    // Sample products
    const productCount = await product.count();
    if (productCount === 0) {
      await product.bulkCreate([
        { name: 'Indomie Goreng', price: 3500, stock: 50 },
        { name: 'Aqua 600ml', price: 3000, stock: 30 },
        { name: 'Sabun Mandi', price: 5000, stock: 20 },
        { name: 'Mie Instan', price: 3000, stock: 15 }
      ]);
      console.log('✅ Sample products created');
    }
  } catch (error) {
    console.error('❌ Sync error:', error.message);
  }
};

module.exports = {
  sequelize,
  user,
  product,
  transaction,
  transactionItem,
  syncDatabase
};