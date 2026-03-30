const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ApiError } = require('../utils/apiError');
const { generateToken } = require('../utils/jwt');
const { loginSchema, registerSchema } = require('../validators/authSchemas');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  role: user.role,
});

const register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) throw new ApiError(400, 'Validation error', error.details);

    const existing = await User.findOne({ email: value.email });
    if (existing) throw new ApiError(409, 'User already exists');

    // Security best practice: let users self-register only as `user`.
    const user = await User.create({ name: value.name, email: value.email, password: value.password, role: 'user' });

    return res.status(201).json({
      token: generateToken({ id: user._id, role: user.role }),
      user: sanitizeUser(user),
    });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) throw new ApiError(400, 'Validation error', error.details);

    const user = await User.findOne({ email: value.email }).select('+password');
    if (!user) throw new ApiError(401, 'Invalid email or password');

    const ok = await bcrypt.compare(value.password, user.password);
    if (!ok) throw new ApiError(401, 'Invalid email or password');

    return res.status(200).json({
      token: generateToken({ id: user._id, role: user.role }),
      user: sanitizeUser(user),
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login };