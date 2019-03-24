import MatchDAO from '../models/match.dao';

export default class MatchController {
  /**
   * Create room for match and broadcast to both player
   * @param {Socket} socket Client Socket object
   * @param {Object} playerOne { socketId, userId }
   * @param {Object} playerTwo { socketId, userId }
   */
  static createRoom(socket, playerOne, playerTwo) {
    // Each Socket in Socket.IO is identified by a random, unguessable, unique identifier
    // and each socket automatically joins a room identified by this id.
    // To send message to specific Socket connection we send message to the default room
    console.log(playerOne);
    console.log(playerTwo);
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
        socket.to(playerOne.socketId).emit('matchSpawned', { roomId: match._id });
        socket.to(playerTwo.socketId).emit('matchSpawned', { roomId: match._id });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
