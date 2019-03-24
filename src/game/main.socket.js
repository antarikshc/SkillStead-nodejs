import socket from 'socket.io';
import _ from 'lodash';

// Root level Socket client
let io;

// Array of Socket ID's to handle matchmaking queue
const queue = [];

export default class SocketController {
  /**
   * Create and start listening Socket connection
   * @param {Server} server
   */
  static async startSocket(server) {
    io = socket(server);

    io.on('connection', (client) => {
      console.log(`Client ${client.id} has been connected`);

      /**
       * Adds the player to queue
       * If a match is found, spawn a room for the players
       */
      client.on('userJoinQueue', () => {
        if (queue.filter(item => item.socketId === client.id).length > 0) {
          console.log('Player already in queue');
          return;
        }

        if (queue.length > 0) {
          const opponentId = (queue.shift()).socketId;
          _.remove(queue, item => item.socketId === opponentId);
          console.log(`${client.id} and ${opponentId} has matched`);
        } else {
          queue.push({ socketId: client.id });
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
