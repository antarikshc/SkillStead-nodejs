import mongoose from 'mongoose';

// Setup matchSchema
const matchSchema = new mongoose.Schema({
  playerOne: {
    player_id: String,
    score: Number
  },
  playerTwo: {
    player_id: String,
    score: Number
  },
  winner: Number, // value 1 & 2 for players, 3 for tie
  questions: [{
    question: String,
    options: [String],
    answer: Number, // index of options
    questionWinner: Number, // value 1 & 2 for players, 3 for tie
    responses: {
      playerOne: {
        answer: Number,
        time: Number, // in second
        isCorrect: Boolean
      },
      playerTwo: {
        answer: Number,
        time: Number, // in second
        isCorrect: Boolean
      }
    }
  }],
  room: [String],
  isCompleted: Boolean
});

// Create and Export schema
module.exports = matchSchema;
