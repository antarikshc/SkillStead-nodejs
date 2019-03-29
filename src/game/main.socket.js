import socket from 'socket.io';
import _ from 'lodash';
import MatchController from './match.socket';

// Root level Socket client
let io;

// Array of Socket ID's to handle matchmaking queue
// Keep Socket Id of each player and userId received in data
const queue = [];

export default class SocketController {
  /**
   * Create and start listening Socket connection
   * @param {Server} server
   */
  static async startSocket(server) {
    io = socket(server);

    MatchController.init(io);

    io.on('connection', (client) => {
      console.log(`Client ${client.id} has been connected`);

      /**
       * Adds the player to queue
       * If a match is found, spawn a room for the players
       */
      client.on('userJoinQueue', (data) => {
        // Check if player is already queueing
        if (queue.filter(item => item.socketId === client.id).length > 0) {
          console.log('Player already in queue');
          return;
        }

        if (queue.length > 0) {
          // Queue has players, match the first player in queue
          const opponent = queue.shift();
          console.log(`${client.id} and ${opponent.socketId} has matched`);

          // Create room and start match
          // Player already present in the queue will become playerOne
          MatchController.createRoom(
            { socketId: opponent.socketId, userId: opponent.userId }, // playerOne
            { socketId: client.id, userId: data.userId } // playerTwo
          );
        } else {
          // Queue is empty, add the player in waiting
          queue.push({
            socketId: client.id,
            userId: data.userId
          });
          console.log(`${client.id} added to match-queue`);
        }
      });

      /**
       * Remove the player from queue
       */
      client.on('userLeaveQueue', () => {
        if (queue.filter(item => item.socketId === client.id).length > 0) {
          _.remove(queue, item => item.socketId === client.id);
          console.log(`${client.id} removed from match-queue`);
        }
      });

      /**
       * Offloading to MatchController
       */
      MatchController.listenForJoinRoom(client);

      client.on('disconnect', () => {
        // Remove player from queue if present
        if (queue.filter(item => item.socketId === client.id).length > 0) {
          _.remove(queue, item => item.socketId === client.id);
          console.log(`${client.id} removed from match-queue`);
        }

        console.log(`Client ${client.id} has been disconnected`);
      });
    });
  }
}
