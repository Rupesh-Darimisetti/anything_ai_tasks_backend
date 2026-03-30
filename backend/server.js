const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { env } = require('./config/env');

const start = async () => {
  // Mongoose is quiet by default; explicit connection makes failures obvious.
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.MONGO_URI);
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');

  const server = app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${env.PORT}`);
  });

  const shutdown = async () => {
    try {
      await mongoose.disconnect();
      server.close(() => process.exit(0));
    } catch (e) {
      process.exit(1);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});

