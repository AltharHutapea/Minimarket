const { product } = require('../models');

exports.showProducts = async (req, res) => {
  try {
    const products = await product.findAll();
    res.render('products/index', { title: 'Manajemen Produk', user: req.session.user || null, products });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Gagal memuat produk', error: {} });
  }
};

exports.showCreateProduct = (req, res) => {
  res.render('products/create', { title: 'Tambah Produk', user: req.session.user || null, error: null });
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, description, image } = req.body;
    await product.create({ name, price: parseFloat(price), stock: parseInt(stock), description, image });
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.render('products/create', { title: 'Tambah Produk', user: req.session.user || null, error: 'Gagal menambahkan produk: ' + error.message });
  }
};

exports.showEditProduct = async (req, res) => {
  try {
    const found = await product.findByPk(req.params.id);
    if (!found) return res.redirect('/products');
    res.render('products/edit', { title: 'Edit Produk', user: req.session.user || null, product: found.toJSON(), error: null });
  } catch (error) {
    res.redirect('/products');
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, stock, description, image } = req.body;
    const found = await product.findByPk(req.params.id);
    if (!found) return res.redirect('/products');
    await found.update({ name, price: parseFloat(price), stock: parseInt(stock), description, image });
    res.redirect('/products');
  } catch (error) {
    res.render('products/edit', { title: 'Edit Produk', user: req.session.user || null, product: { id: req.params.id }, error: 'Gagal mengupdate produk: ' + error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const found = await product.findByPk(req.params.id);
    if (found) await found.destroy();
    res.redirect('/products');
  } catch (error) {
    res.redirect('/products');
  }
};