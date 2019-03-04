import mongoose from 'mongoose';

// Setup userSchema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name cannot be blank!'
  },
  email: {
    type: String,
    required: 'Email-ID cannot be blank!'
  },
  mobile: String,
  headline: String,
  password: {
    type: String,
    select: false // Won't include in response
  },
  fcm: [{
    token: String
  }]
});

// Create and Export schema
module.exports = userSchema;
