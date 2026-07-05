const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'minimarket',
  'root',
  '',
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

// ✅ Test koneksi (jangan pakai top-level await)
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = sequelize;