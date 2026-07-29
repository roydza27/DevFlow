export function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Invalid MongoDB ObjectId format
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // Mongoose schema validation failure
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({ message: 'Validation failed', errors });
  }

  res.status(500).json({ message: 'Internal Server Error' });
}
