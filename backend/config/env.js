const Joi = require('joi');

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(5000),
  MONGO_URI: Joi.string().min(10).required(),
  JWT_SECRET: Joi.string().min(10).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  CORS_ORIGIN: Joi.string().optional(),
});

const { error, value } = schema.validate(process.env, { abortEarly: true, allowUnknown: true });
if (error) {
  // eslint-disable-next-line no-console
  console.error('Environment validation error:', error.message);
  process.exit(1);
}

// Normalize into a convenient object.
const env = {
  NODE_ENV: value.NODE_ENV,
  PORT: value.PORT,
  MONGO_URI: value.MONGO_URI,
  JWT_SECRET: value.JWT_SECRET,
  JWT_EXPIRES_IN: value.JWT_EXPIRES_IN,
  CORS_ORIGIN: value.CORS_ORIGIN,
};

module.exports = { env };

