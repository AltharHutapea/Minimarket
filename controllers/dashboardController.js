const { user, product, transaction } = require('../models');
const { Op } = require('sequelize');

exports.showDashboard = async (req, res) => {
  try {
    const totalUsers = await user.count();
    const activeUsers = await user.count({ where: { is_active: true } });
    const totalProducts = await product.count();

    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTransactions = await transaction.findAll({
      where: {
        created_at: { [Op.gte]: today, [Op.lt]: tomorrow },
        status: 'selesai'
      }
    });
    const totalTransactionsToday = todayTransactions.length;
    const totalRevenueToday = todayTransactions.reduce((sum, t) => sum + parseFloat(t.total_amount), 0);

    const lowStockCount = await product.count({ where: { stock: { [Op.lt]: 5 } } });

    res.render('dashboard', {
      title: 'Dashboard',
      user: req.session.user || null,
      stats: {
        totalUsers,
        activeUsers,
        totalProducts,
        totalTransactionsToday,
        totalRevenueToday,
        lowStockCount
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('dashboard', {
      title: 'Dashboard',
      user: req.session.user || null,
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        totalProducts: 0,
        totalTransactionsToday: 0,
        totalRevenueToday: 0,
        lowStockCount: 0
      }
    });
  }
};