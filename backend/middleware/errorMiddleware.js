const mongoose = require('mongoose');
const { ApiError } = require('../utils/apiError');

const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: 'Not Found',
  });
};

// Centralized error handler.
// Keep responses consistent for frontend + easier debugging.
const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(`[${req.requestId || 'no-request-id'}]`, err);

  let apiError;

  if (err instanceof ApiError) {
    apiError = err;
  } else if (err && err.name === 'ValidationError') {
    apiError = new ApiError(400, 'Validation error', err.message);
  } else if (err instanceof mongoose.Error.CastError) {
    apiError = new ApiError(400, 'Invalid id', err.message);
  } else if (err && err.code === 11000) {
    apiError = new ApiError(409, 'Duplicate value', 'Resource already exists');
  } else {
    apiError = new ApiError(500, 'Internal Server Error');
  }

  res.status(apiError.statusCode).json({
    message: apiError.message,
    ...(apiError.details ? { details: apiError.details } : null),
    requestId: req.requestId,
    ...(process.env.NODE_ENV === 'development' && apiError.stack ? { stack: apiError.stack } : null),
  });
};

module.exports = { notFoundHandler, errorHandler };

