const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const transaction = sequelize.define('transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  payment_method: {
    type: DataTypes.ENUM('tunai', 'qris', 'transfer'),
    defaultValue: 'tunai'
  },
  status: {
    type: DataTypes.ENUM('selesai', 'proses', 'batal'),
    defaultValue: 'selesai'
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = transaction;