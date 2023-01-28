const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    unique: true,
    minLength: 4,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minLength: 6
  }
})


module.exports = userSchema;