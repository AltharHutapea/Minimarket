const express = require('express');
const router = express.Router();
const {
  showStockReport,
  exportStockPDF
} = require('../controllers/reportController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// Semua route harus login
router.use(isAuthenticated);

// ✅ Route laporan stok
router.get('/stock', hasRole('admin', 'manager'), showStockReport);

// ✅ Route untuk laporan stok menipis (redirect ke stock dengan filter)
router.get('/low-stock', hasRole('admin', 'manager'), (req, res) => {
  res.redirect('/reports/stock?filter=menipis');
});

// ✅ Route export PDF
router.get('/stock/export', hasRole('admin', 'manager'), exportStockPDF);

module.exports = router;