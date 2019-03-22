import mongoose from 'mongoose';

function arrayLimit(val) {
  return val.length <= 4;
}

// Setup questionSchema
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: 'Question cannot be blank!'
  },
  options: {
    type: [
      String
    ],
    validate: [arrayLimit, '{PATH} exceeds the limit of 4']
  },
  answer: Number // Index of options
});

questionSchema.index({ question: 1, type: -1 });

// Create and Export schema
module.exports = questionSchema;
