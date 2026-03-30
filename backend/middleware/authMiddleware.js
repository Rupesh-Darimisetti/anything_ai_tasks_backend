const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { ApiError } = require('../utils/apiError');

const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
};

// Verifies JWT for protected routes.
const protect = (req, res, next) => {
  const token = extractBearerToken(req);
  if (!token) return next(new ApiError(401, 'Unauthorized: missing bearer token'));

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (error) {
    return next(new ApiError(401, 'Unauthorized: invalid or expired token'));
  }
};

// Role-based guard (RBAC).
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: insufficient permissions'));
    }
    return next();
  };
};

module.exports = { protect, authorize };