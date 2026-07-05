const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  const status = err.status || 500;
  res.status(status);
  const view = status === 404 ? '404' : '500';
  res.render(view, {
    message: err.message || 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;