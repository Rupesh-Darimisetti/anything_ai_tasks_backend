const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('../models/User');

// Load repo-root .env (same convention as `server.js`)
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const readArg = (name) => {
  const prefix = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
};

const main = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    // eslint-disable-next-line no-console
    console.error('Missing MONGO_URI. Ensure your root `.env` exists and contains MONGO_URI.');
    process.exit(1);
  }

  const name = readArg('name') || process.env.ADMIN_NAME || 'Admin';
  const email = readArg('email') || process.env.ADMIN_EMAIL;
  const password = readArg('password') || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    // eslint-disable-next-line no-console
    console.error(
      'Missing admin credentials.\n' +
        'Provide either:\n' +
        '  - env vars: ADMIN_EMAIL, ADMIN_PASSWORD (optional ADMIN_NAME)\n' +
        '  - CLI flags: --email=... --password=... [--name=...]\n'
    );
    process.exit(1);
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    if (existing.role === 'admin') {
      // eslint-disable-next-line no-console
      console.log(`User already exists and is already an admin: ${email}`);
      await mongoose.disconnect();
      return;
    }

    existing.role = 'admin';
    // If password should be rotated, update it (will re-hash via pre-save hook)
    existing.password = password;
    await existing.save();

    // eslint-disable-next-line no-console
    console.log(`Updated existing user to admin: ${email}`);
    await mongoose.disconnect();
    return;
  }

  await User.create({
    name,
    email,
    password,
    role: 'admin',
  });

  // eslint-disable-next-line no-console
  console.log(`Created admin user: ${email}`);
  await mongoose.disconnect();
};

main().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to create admin user:', err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
