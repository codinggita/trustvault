const mongoose = require('mongoose');
require('dotenv').config();
const userModel = require('./src/models/user.model');
const accountModel = require('./src/models/account.model');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for setup');

    // Check if system user already exists
    let systemUser = await userModel.findOne({ systemUser: true });
    if (!systemUser) {
      // Create system user
      systemUser = await userModel.create({
        email: 'system@trustvault.com',
        name: 'System User',
        password: 'SystemPass123!', // In real scenario, this would be hashed and not known
        systemUser: true
      });
      console.log('System user created:', systemUser._id);
    } else {
      console.log('System user already exists:', systemUser._id);
    }

    // Check if system user already has an account
    let systemAccount = await accountModel.findOne({ user: systemUser._id });
    if (!systemAccount) {
      // Create account for system user
      systemAccount = await accountModel.create({
        user: systemUser._id,
        status: 'ACTIVE',
        currency: 'INR'
      });
      console.log('System account created:', systemAccount._id);
    } else {
      console.log('System account already exists:', systemAccount._id);
    }

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Setup error:', err);
    process.exit(1);
  });
