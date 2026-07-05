const express = require('express');
const router = express.Router();
const { showProducts, showCreateProduct, createProduct, showEditProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.use(isAuthenticated);
router.get('/', hasRole('admin', 'manager'), showProducts);
router.get('/create', hasRole('admin'), showCreateProduct);
router.post('/create', hasRole('admin'), createProduct);
router.get('/:id/edit', hasRole('admin'), showEditProduct);
router.post('/:id/update', hasRole('admin'), updateProduct);
router.get('/:id/delete', hasRole('admin'), deleteProduct);

module.exports = router;