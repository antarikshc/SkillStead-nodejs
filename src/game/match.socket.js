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
        player_id: playerOne.userId
      },
      playerTwo: {
        player_id: playerTwo.userId
      },
      isCompleted: false
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
   * @param {Socket} socket Socket
   */
  static listenForJoinRoom(socket) {
    socket.on('joinRoom', (data) => {
      socket.join(data.roomId);
      console.log(`${socket.id} joined the room ${data.roomId}`);

      if (data.player === 2) {
        this.initMatch(data.roomId);
      }

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
   * Send 10 Random questions through socket and stores it in Redis
   */
  static sendQuestions(roomId) {
    QuestionDAO.getAllQuestions()
      .then((questions) => {
        // Shuffle array
        const shuffled = questions.sort(() => 0.5 - Math.random());
        // Get sub-array of first 10 elements after shuffled
        const selected = shuffled.slice(0, 10);
        // Save it in Redis
        RedisClient.setQuestions(roomId, selected);

        io.to(roomId).emit(
          'matchStarted',
          selected,
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
