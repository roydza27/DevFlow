export function errorHandler(err, req, res, next) {
  console.error('[DevFlow Service Error]:', err.message || err);

  // SQLite constraint or syntax errors
  if (err.code && err.code.startsWith('SQLITE_')) {
    return res.status(400).json({
      success: false,
      error: {
        message: err.message || 'Database operation failed',
        code: err.code,
      },
    });
  }

  res.status(500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    },
  });
}

