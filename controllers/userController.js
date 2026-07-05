const { user } = require('../models');

exports.showUsers = async (req, res) => {
  try {
    const users = await user.findAll({ attributes: { exclude: ['password'] }, order: [['id', 'ASC']] });
    res.render('users/index', { title: 'Manajemen User', user: req.session.user || null, users: users || [], message: req.query.message || null, error: req.query.error || null });
  } catch (error) {
    console.error(error);
    res.render('users/index', { title: 'Manajemen User', user: req.session.user || null, users: [], message: null, error: 'Gagal memuat data user' });
  }
};

exports.showCreateUser = (req, res) => {
  res.render('users/create', { title: 'Tambah User', user: req.session.user || null, error: null, name: '', email: '', role: 'cashier' });
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.render('users/create', { title: 'Tambah User', user: req.session.user || null, error: 'Semua field harus diisi!', name, email, role: role || 'cashier' });
    }
    if (password.length < 6) {
      return res.render('users/create', { title: 'Tambah User', user: req.session.user || null, error: 'Password minimal 6 karakter!', name, email, role: role || 'cashier' });
    }
    const existing = await user.findOne({ where: { email } });
    if (existing) {
      return res.render('users/create', { title: 'Tambah User', user: req.session.user || null, error: 'Email sudah terdaftar!', name, email, role: role || 'cashier' });
    }
    await user.create({ name, email, password, role: role || 'cashier', is_active: true });
    res.redirect('/users?message=User berhasil ditambahkan');
  } catch (error) {
    console.error(error);
    res.render('users/create', { title: 'Tambah User', user: req.session.user || null, error: 'Gagal menambahkan user', name: req.body.name || '', email: req.body.email || '', role: req.body.role || 'cashier' });
  }
};

exports.showEditUser = async (req, res) => {
  try {
    const foundUser = await user.findByPk(req.params.id);
    if (!foundUser) return res.redirect('/users?error=User tidak ditemukan');
    res.render('users/edit', { title: 'Edit User', user: req.session.user || null, editUser: foundUser.toJSON(), error: null });
  } catch (error) {
    console.error(error);
    res.redirect('/users?error=Gagal memuat data user');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, is_active, password } = req.body;
    const foundUser = await user.findByPk(req.params.id);
    if (!foundUser) return res.redirect('/users?error=User tidak ditemukan');
    const updateData = { name, email, role, is_active: is_active === 'on' ? true : false };
    if (password && password.length > 0) updateData.password = password;
    await foundUser.update(updateData);
    res.redirect('/users?message=User berhasil diupdate');
  } catch (error) {
    console.error(error);
    res.render('users/edit', { title: 'Edit User', user: req.session.user || null, editUser: { id: req.params.id }, error: 'Gagal mengupdate user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const foundUser = await user.findByPk(req.params.id);
    if (foundUser) await foundUser.destroy();
    res.redirect('/users?message=User berhasil dihapus');
  } catch (error) {
    console.error(error);
    res.redirect('/users?error=Gagal menghapus user');
  }
};