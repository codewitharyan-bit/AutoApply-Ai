const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (statusCode >= 500) {
    console.error(`[${statusCode}] ${err.message}`, err.stack || '');
  } else {
    console.warn(`[${statusCode}] ${err.message}`);
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
