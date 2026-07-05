const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT),
    logging: false,
    dialectOptions: {
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      }
    }
  }
);

// ✅ Test koneksi
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = sequelize;
