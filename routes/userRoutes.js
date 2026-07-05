const express = require('express');
const router = express.Router();
const { showUsers, showCreateUser, createUser, showEditUser, updateUser, deleteUser } = require('../controllers/userController');
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.use(isAuthenticated);
router.get('/', hasRole('admin', 'manager'), showUsers);
router.get('/create', hasRole('admin', 'manager'), showCreateUser);
router.post('/create', hasRole('admin', 'manager'), createUser);
router.get('/:id/edit', hasRole('admin', 'manager'), showEditUser);
router.post('/:id/update', hasRole('admin', 'manager'), updateUser);
router.get('/:id/delete', hasRole('admin'), deleteUser);

module.exports = router;