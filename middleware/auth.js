const { user: UserModel } = require('../models');
const jwt = require('jsonwebtoken');

// === WEB SESSION MIDDLEWARE ===
exports.isAuthenticated = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
};

exports.hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.role)) {
      return res.status(403).render('error', { message: 'Akses ditolak!', error: { status: 403 } });
    }
    next();
  };
};

exports.loadUser = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await UserModel.findByPk(req.session.userId);
      if (user) {
        req.session.user = user.toJSON();
        res.locals.user = req.session.user;
        res.locals.isLoggedIn = true;
      }
    } catch (error) {
      console.error('Load user error:', error);
    }
  } else {
    res.locals.user = null;
    res.locals.isLoggedIn = false;
  }
  next();
};

// === API JWT MIDDLEWARE ===
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token tidak disediakan' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token tidak valid' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid atau kadaluarsa' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses ditolak, hanya admin' });
  }
  next();
};