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
    validate: {
      validator: (email) => {
        const validate = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){3,12}[a-zA-Z0-9]$/;
        return validate.test(email);
      },
      message: 'Username is not valid!'
    }
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (email) => {
        const validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return validate.test(email);
      },
      message: 'Email is not valid!'
    }
  },
  password: {
    type: String,
    trim: true,
    required: true
  }
})


module.exports = userSchema;