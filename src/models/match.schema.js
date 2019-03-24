import mongoose from 'mongoose';

// Setup matchSchema
const matchSchema = new mongoose.Schema({
  playerOne: {
    player_id: String,
    score: String
  },
  playerTwo: {
    player_id: String,
    score: String
  },
  questions: [{
    question: String,
    options: [String],
    answer: Number, // index of options
    winner: Number // value 1 & 2 for players
  }],
  isCompleted: Boolean
});

// Create and Export schema
module.exports = matchSchema;
