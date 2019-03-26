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
          {
            playerOne: 0,
            playerTwo: 0,
            questionCount: 0
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static listenForJoinRoom(socket) {
    socket.on('joinRoom', (data) => {
      socket.join(data.roomId);
      console.log(`${socket.id} joined the room ${data.roomId}`);

      RedisClient.getMatchStatus(data.roomId)
        .then((res) => {
          const matchStatus = JSON.parse(res);
          if (matchStatus.playerOne === 1 && matchStatus.playerTwo === 1) {
            this.initMatch(data.roomId);
          } else {
            console.log(matchStatus);
            if (data.player === 1) {
              matchStatus.playerOne = 1;
            } else if (data.player === 2) {
              matchStatus.playerTwo = 1;
            }
          }
        });
    });
  }

  /**
   * Emit matchStarted flag
   * @param {String} roomId
   */
  static initMatch(roomId) {
    io.to(roomId).emit(
      'matchStarted',
      JSON.parse(RedisClient.getMatchStatus(`${roomId}-status`))
    );
  }
}
