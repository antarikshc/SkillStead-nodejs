import mongoose from 'mongoose';

// Setup categorySchema
const categorySchema = new mongoose.Schema({
  code: String,
  name: {
    type: String,
    required: 'Category name cannot be blank!'
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }]
});

// Create and Export schema
module.exports = categorySchema;
