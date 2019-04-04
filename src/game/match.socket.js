import MatchDAO from '../models/match.dao';
import RedisClient from './redis.client';
import QuestionDAO from '../models/question.dao';

// Root Socket
let io;

export default class MatchController {
  /**
   * Store Root socket host
   * @param {Socket} socketRoot
   */
  static init(socketRoot) {
    io = socketRoot;
  }

  /**
   * Create room for match and broadcast to both player
   * @param {Socket} socketRoot Root Socket object
   * @param {Object} playerOne { socketId, userId }
   * @param {Object} playerTwo { socketId, userId }
   */
  static createRoom(playerOne, playerTwo) {
    // Each Socket in Socket.IO is identified by a random, unguessable, unique identifier
    // and each socket automatically joins a room identified by this id.
    // To send message to specific Socket connection we send message to the default room
    MatchDAO.createMatch({
      playerOne: {
        player_id: playerOne.userId,
        score: 0
      },
      playerTwo: {
        player_id: playerTwo.userId,
        score: 0
      },
      status: 0
    })
      .then((match) => {
        // Create and emit room details to both players
        // Here matchId is the roomId
        console.log(`Created room ${match._id}`);
        io.to(playerOne.socketId).emit('matchSpawned', { roomId: match._id, player: 1 });
        io.to(playerTwo.socketId).emit('matchSpawned', { roomId: match._id, player: 2 });

        RedisClient.setMatchStatus(
          match._id,
          match
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Listener for Join room, if both players are joined initiate match
   * @param {Socket} socket Socket Client
   */
  static listenForJoinRoom(socket) {
    socket.on('joinRoom', (data) => {
      socket.join(data.roomId);
      console.log(`${socket.id} joined the room ${data.roomId}`);

      setTimeout(() => {
        this.initMatch(data.roomId);
      }, 1500);

      // TODO: We can keep the above delay and then
      // check whether both players have joined room or not
      // Start or cancel match after that

      // RedisClient.getMatchStatus(data.roomId)
      //   .then((res) => {
      //     const matchStatus = JSON.parse(res);

      //     matchStatus.room.push(socket.id);

      //     RedisClient.setMatchStatus(data.roomId, matchStatus);
      //     console.log(matchStatus.room);
      //     if (matchStatus.room.length === 2) {
      //       this.initMatch(data.roomId);
      //     }
      //   });
    });
  }

  /**
   * Emit matchStarted flag
   * @param {String} roomId
   */
  static initMatch(roomId) {
    this.sendQuestions(roomId);
  }

  /**
   * Listener for recording responses
   * @param {Socket} socket Client
   */
  static listenForResponse(socket) {
    socket.on('recordResponse', (data) => {
      this.addResponse(data.match, data.response);
    });
  }

  /**
   * Emit for next question
   * @param {String} roomId
   * @param {Int} winner Player number
   */
  static emitNextQuestion(roomId, winner) {
    io.to(roomId).emit('queueNextQuestion', { winner });
  }


  /**
   * Send 10 Random questions through socket and stores it in Redis
   */
  static sendQuestions(roomId) {
    QuestionDAO.getAllQuestions()
      .then((questions) => {
        // Shuffle array
        const shuffled = questions.sort(() => 0.5 - Math.random());
        // Get sub-array of first 10 elements after shuffled
        const selected = shuffled.slice(0, 10);

        RedisClient.getMatchStatus(roomId)
          .then((match) => {
            const matchStatus = JSON.parse(match);
            if (matchStatus.status === 0) {
              // Save it in Redis
              RedisClient.setQuestions(roomId, selected);

              io.to(roomId).emit(
                'matchStarted',
                selected,
              );
            } else {
              console.log('Match ongoing, Questions already sent.');
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
 * Record response of player
 * @param {Object} match
 * @param {Object} response
 */
  static addResponse(match, response) {
    RedisClient.getMatchStatus(match.id)
      .then((result) => {
        const matchStatus = JSON.parse(result);
        const currentQuestion = matchStatus.questions[match.count];

        if (!('responses' in currentQuestion)) {
          currentQuestion.responses = {};
        }

        if (match.player === 1) {
          console.log('Response received for Player One');
          currentQuestion.responses.playerOne = response;
          matchStatus.questions[match.count] = currentQuestion;

          if ('playerTwo' in currentQuestion.responses) {
            // If both players have recorded responses then calculate winner
            this.calculateWinner(matchStatus, match.count);
          } else {
            // Just update Match Status
            RedisClient.setMatchStatus(match.id, matchStatus);
          }
        } else if (match.player === 2) {
          console.log('Response received for Player Two');
          currentQuestion.responses.playerTwo = response;
          matchStatus.questions[match.count] = currentQuestion;

          if ('playerOne' in currentQuestion.responses) {
            // If both players have recorded responses then calculate winner
            this.calculateWinner(matchStatus, match.count);
          } else {
            // Just update Match Status
            RedisClient.setMatchStatus(match.id, matchStatus);
          }
        }
      });
  }

  /**
   * Calculate winner by addressing all the cases
   * @param {Object} matchStatus
   * @param {Int} questionCount
   */
  static calculateWinner(matchStatus, questionCount) {
    const match = matchStatus;
    const question = match.questions[questionCount];

    if (question.responses.playerOne.isCorrect
      && question.responses.playerTwo.isCorrect) {
      // Check timing and decide winner
      if (question.responses.playerOne.time > question.responses.playerTwo.time) {
        // Player One won
        console.log(`Round ${questionCount}: Player One`);
        question.questionWinner = 1;
        match.playerOne.score += 10;
        match.playerTwo.score += 5;
      } else if (question.responses.playerOne.time
        < question.responses.playerTwo.time) {
        // Player Two won
        console.log(`Round ${questionCount}: Player Two`);
        question.questionWinner = 2;
        match.playerOne.score += 5;
        match.playerTwo.score += 10;
      } else {
        // Tie
        console.log(`Round ${questionCount}: Tie`);
        question.questionWinner = 3;
        match.playerOne.score += 5;
        match.playerTwo.score += 5;
      }
    } else if (question.responses.playerOne.isCorrect
      && !question.responses.playerTwo.isCorrect) {
      // Player One won
      console.log(`Round ${questionCount}: Player One`);
      question.questionWinner = 1;
      match.playerOne.score += 10;
      match.playerTwo.score += 0;
    } else if (!question.responses.playerOne.isCorrect
      && question.responses.playerTwo.isCorrect) {
      // Player Two won
      console.log(`Round ${questionCount}: Player Two`);
      question.questionWinner = 2;
      match.playerOne.score += 0;
      match.playerTwo.score += 10;
    } else if (!question.responses.playerOne.isCorrect
      && !question.responses.playerTwo.isCorrect) {
      // Both players are dumb
      console.log(`Round ${questionCount}: Tie`);
      question.questionWinner = 3;
    }

    match.questions[questionCount] = question;
    RedisClient.setMatchStatus(match._id, match);
    if (questionCount < 10) {
      this.emitNextQuestion(match._id, question.questionWinner);
    }
  }
}
