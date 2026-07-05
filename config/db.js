const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'minimarket',
  '2n32FnfBzv4XyJi.root',
  'RmncRgulo_08',
  {
    host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
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
