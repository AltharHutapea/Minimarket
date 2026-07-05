const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const transactionItem = sequelize.define('transactionItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  }
}, {
  tableName: 'transaction_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = transactionItem;