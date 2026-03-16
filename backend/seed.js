const dotenv = require('dotenv');

const connectDB = require('./config/db');
const { ensureSystemAccount, getSystemProfile } = require('./services/systemService');

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    const systemProfile = getSystemProfile();

    if (!systemProfile.password) {
      throw new Error('SYSTEM_USER_PASSWORD must be set in backend/.env before running the seed.');
    }

    const { systemAccount } = await ensureSystemAccount();

    console.log('TrustVault seed complete.');
    console.log(`System user email: ${systemProfile.email}`);
    console.log('System user password: [from SYSTEM_USER_PASSWORD in backend/.env]');
    console.log(`SYSTEM_ACCOUNT_ID=${systemAccount._id.toString()}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
