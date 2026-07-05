const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const user = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nama tidak boleh kosong' }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: { msg: 'Email sudah terdaftar' },
    validate: {
      isEmail: { msg: 'Format email tidak valid' },
      notEmpty: { msg: 'Email tidak boleh kosong' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password tidak boleh kosong' },
      len: { args: [6, 255], msg: 'Password minimal 6 karakter' }
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'cashier'),
    defaultValue: 'cashier'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Hash password sebelum create
user.beforeCreate(async (userInstance) => {
  if (userInstance.password) {
    const salt = await bcrypt.genSalt(10);
    userInstance.password = await bcrypt.hash(userInstance.password, salt);
  }
});

// Hash password sebelum update jika password diubah
user.beforeUpdate(async (userInstance) => {
  if (userInstance.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    userInstance.password = await bcrypt.hash(userInstance.password, salt);
  }
});

// Method untuk membandingkan password
user.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Hilangkan password dari output JSON
user.prototype.toJSON = function() {
  const data = Object.assign({}, this.get());
  delete data.password;
  return data;
};

module.exports = user;