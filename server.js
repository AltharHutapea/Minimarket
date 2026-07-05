require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('express-flash');
const { syncDatabase, user } = require('./models');
const { loadUser } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(flash());

app.use(session({
  secret: process.env.SESSION_SECRET || 'rahasia_session_default_ubah_di_produksi',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(loadUser);

// Web routes
app.use('/', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/transactions', require('./routes/transactionRoutes'));
app.use('/reports', require('./routes/reportRoutes'));

// API routes (JWT)
app.use('/api/auth', require('./routes/api/authRoutes'));

// Dashboard
const dashboardController = require('./controllers/dashboardController');
app.get('/dashboard', require('./middleware/auth').isAuthenticated, dashboardController.showDashboard);

app.get('/', (req, res) => res.redirect('/dashboard'));

app.use(errorHandler);

const startServer = async () => {
  try {
    await syncDatabase();
    const adminExists = await user.findOne({ where: { email: 'admin@minimarket.com' } });
    if (!adminExists) {
      await user.create({ name: 'Admin Utama', email: 'admin@minimarket.com', password: 'admin123', role: 'admin' });
      console.log('✅ Admin created');
    }
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};
startServer();