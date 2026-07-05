const { user } = require('../models');

exports.showLogin = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/login', { title: 'Login', error: null, email: '' });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await user.findOne({ where: { email } });
    if (!foundUser) {
      return res.render('auth/login', { title: 'Login', error: 'Email atau password salah', email });
    }
    const isValid = await foundUser.comparePassword(password);
    if (!isValid) {
      return res.render('auth/login', { title: 'Login', error: 'Email atau password salah', email });
    }
    req.session.userId = foundUser.id;
    req.session.user = foundUser.toJSON();
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('auth/login', { title: 'Login', error: 'Terjadi kesalahan', email: req.body.email || '' });
  }
};

exports.showRegister = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/register', { title: 'Register', error: null, name: '', email: '', role: 'cashier' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await user.findOne({ where: { email } });
    if (existing) {
      return res.render('auth/register', { title: 'Register', error: 'Email sudah terdaftar', name, email, role });
    }
    if (password.length < 6) {
      return res.render('auth/register', { title: 'Register', error: 'Password minimal 6 karakter', name, email, role });
    }
    await user.create({ name, email, password, role: role || 'cashier' });
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('auth/register', { title: 'Register', error: 'Registrasi gagal', name: req.body.name || '', email: req.body.email || '', role: req.body.role || 'cashier' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};