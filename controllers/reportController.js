const { product, sequelize } = require('../models');  // ✅ IMPORT SEQUELIZE
const { Op } = require('sequelize');

// ✅ Tampilkan laporan stok
const showStockReport = async (req, res) => {
  try {
    const { filter } = req.query;
    
    let whereCondition = {};
    
    // Filter berdasarkan status stok
    if (filter === 'menipis') {
      whereCondition = {
        stock: {
          [Op.lte]: sequelize.col('min_stock')  // ✅ SEKARANG BISA PAKAI
        }
      };
    } else if (filter === 'habis') {
      whereCondition = {
        stock: 0
      };
    }

    const products = await product.findAll({
      where: whereCondition,
      order: [['name', 'ASC']]
    });

    // Hitung statistik
    const totalProducts = await product.count();
    const lowStock = await product.count({
      where: {
        stock: {
          [Op.lte]: sequelize.col('min_stock')  // ✅ SEKARANG BISA PAKAI
        }
      }
    });
    const outOfStock = await product.count({
      where: { stock: 0 }
    });

    res.render('reports/stock', {
      title: 'Laporan Stok',
      user: req.session.user || null,
      products: products || [],
      stats: {
        total: totalProducts,
        lowStock: lowStock,
        outOfStock: outOfStock
      },
      filter: filter || 'semua',
      message: req.query.message || null,
      error: req.query.error || null
    });
  } catch (error) {
    console.error('Error loading stock report:', error);
    res.render('reports/stock', {
      title: 'Laporan Stok',
      user: req.session.user || null,
      products: [],
      stats: { total: 0, lowStock: 0, outOfStock: 0 },
      filter: 'semua',
      message: null,
      error: 'Gagal memuat laporan stok: ' + error.message
    });
  }
};

// ✅ Export laporan stok ke PDF
const exportStockPDF = async (req, res) => {
  try {
    const products = await product.findAll({
      order: [['name', 'ASC']]
    });

    res.render('reports/stock-print', {
      title: 'Laporan Stok',
      products: products,
      date: new Date().toLocaleString('id-ID')
    });
  } catch (error) {
    console.error('Error exporting stock report:', error);
    res.redirect('/reports/stock?error=Gagal mengekspor laporan');
  }
};

module.exports = {
  showStockReport,
  exportStockPDF
};