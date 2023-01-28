const mongoose = require('mongoose');

const followerSchema = mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false
  },
  following: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false
  }
});

module.exports = followerSchema;