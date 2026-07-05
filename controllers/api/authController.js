const { user } = require('../../models');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await user.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email sudah terdaftar' });
    const newUser = await user.create({ name, email, password, role: role || 'cashier' });
    res.status(201).json({ message: 'Registrasi berhasil', user: newUser.toJSON() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await user.findOne({ where: { email } });
    if (!foundUser) return res.status(401).json({ error: 'Email atau password salah' });
    const isValid = await foundUser.comparePassword(password);
    if (!isValid) return res.status(401).json({ error: 'Email atau password salah' });
    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email, role: foundUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ message: 'Login sukses', token, user: foundUser.toJSON() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout berhasil' });
};