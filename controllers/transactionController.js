const { transaction, product, user, transactionItem } = require('../models');

// Tampilkan semua transaksi
exports.showTransactions = async (req, res) => {
  try {
    const transactions = await transaction.findAll({
      include: [{ model: user, attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']]
    });
    res.render('transactions/index', {
      title: 'Riwayat Transaksi',
      user: req.session.user || null,
      transactions: transactions || [],
      message: req.query.message || null,
      error: req.query.error || null
    });
  } catch (error) {
    console.error(error);
    res.render('transactions/index', { title: 'Riwayat Transaksi', user: req.session.user || null, transactions: [], message: null, error: 'Gagal memuat data transaksi' });
  }
};

// Tampilkan form transaksi baru
exports.showCreateTransaction = async (req, res) => {
  try {
    const products = await product.findAll({ order: [['name', 'ASC']] });
    res.render('transactions/new', {
      title: 'Transaksi Baru',
      user: req.session.user || null,
      products: products || [],
      error: products.length === 0 ? 'Belum ada produk. Tambahkan produk terlebih dahulu.' : null
    });
  } catch (error) {
    console.error(error);
    res.render('transactions/new', { title: 'Transaksi Baru', user: req.session.user || null, products: [], error: 'Gagal memuat data produk: ' + error.message });
  }
};

// Proses simpan transaksi (dengan validasi stok & update stok)
exports.createTransaction = async (req, res) => {
  try {
    const { items, total_amount, payment_method } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.redirect('/transactions?error=Pilih minimal satu produk');
    }

    // 1. Validasi stok
    for (const item of items) {
      const prod = await product.findByPk(item.product_id);
      if (!prod) {
        return res.redirect(`/transactions?error=Produk ID ${item.product_id} tidak ditemukan`);
      }
      if (prod.stock < parseInt(item.qty)) {
        return res.redirect(`/transactions?error=Stok ${prod.name} tidak cukup (sisa ${prod.stock})`);
      }
    }

    // 2. Kurangi stok
    for (const item of items) {
      const prod = await product.findByPk(item.product_id);
      await prod.update({ stock: prod.stock - parseInt(item.qty) });
    }

    // 3. Buat transaksi
    const newTransaction = await transaction.create({
      invoice_number: generateInvoiceNumber(),
      user_id: req.session.userId,
      total_amount: total_amount || 0,
      payment_method: payment_method || 'tunai',
      status: 'selesai'
    });

    // 4. Simpan item transaksi
    for (const item of items) {
      await transactionItem.create({
        transaction_id: newTransaction.id,
        product_id: parseInt(item.product_id),
        qty: parseInt(item.qty),
        price: parseInt(item.price) || 0
      });
    }

    res.redirect('/transactions?message=Transaksi berhasil dibuat');
  } catch (error) {
    console.error('❌ Error creating transaction:', error);
    res.redirect('/transactions?error=Gagal membuat transaksi: ' + error.message);
  }
};

// Detail transaksi
exports.showDetailTransaction = async (req, res) => {
  try {
    const foundTransaction = await transaction.findByPk(req.params.id, {
      include: [
        { model: user, attributes: ['id', 'name'] },
        { model: transactionItem, as: 'transactionItems', include: [{ model: product, as: 'product', attributes: ['id', 'name'] }] }
      ]
    });
    if (!foundTransaction) return res.redirect('/transactions?error=Transaksi tidak ditemukan');
    res.render('transactions/detail', { title: 'Detail Transaksi', user: req.session.user || null, transaction: foundTransaction });
  } catch (error) {
    console.error(error);
    res.redirect('/transactions?error=Gagal memuat detail transaksi');
  }
};

// Print struk
exports.printTransaction = async (req, res) => {
  try {
    const foundTransaction = await transaction.findByPk(req.params.id, {
      include: [
        { model: user, attributes: ['id', 'name'] },
        { model: transactionItem, as: 'transactionItems', include: [{ model: product, as: 'product', attributes: ['id', 'name'] }] }
      ]
    });
    if (!foundTransaction) return res.redirect('/transactions?error=Transaksi tidak ditemukan');
    res.render('transactions/print', { title: 'Struk Transaksi', transaction: foundTransaction, user: req.session.user || null });
  } catch (error) {
    console.error(error);
    res.redirect('/transactions?error=Gagal mencetak struk');
  }
};

function generateInvoiceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `INV-${year}${month}${day}-${random}`;
}