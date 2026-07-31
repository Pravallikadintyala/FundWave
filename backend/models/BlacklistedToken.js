const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // auto-delete after 1 hour (matches token expiry)
  },
});

module.exports = mongoose.model('BlacklistedToken', blacklistSchema);