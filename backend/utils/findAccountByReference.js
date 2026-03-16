const mongoose = require('mongoose');

const Account = require('../models/Account');

const findAccountByReference = async (reference, session) => {
  if (!reference) {
    return null;
  }

  const query = mongoose.isValidObjectId(reference)
    ? Account.findById(reference)
    : Account.findOne({ accountNumber: reference });

  if (session) {
    query.session(session);
  }

  return query.populate('userId', 'name email isSystemUser');
};

module.exports = findAccountByReference;

