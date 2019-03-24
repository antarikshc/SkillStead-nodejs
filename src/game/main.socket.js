import socket from 'socket.io';
import _ from 'lodash';

let io;
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

      client.on('userJoinQueue', () => {
        queue.push({ socketId: client.id });
        console.log(`${client.id} added to match-queue`);
      });

      client.on('userLeaveQueue', () => {
        if (queue.filter(item => item.socketId === client.id).length > 0) {
          _.remove(queue, item => item.socketId === client.id);
          console.log(`${client.id} removed from match-queue`);
        }
      });

      client.on('disconnect', () => {
        if (queue.filter(item => item.socketId === client.id).length > 0) {
          _.remove(queue, item => item.socketId === client.id);
          console.log(`${client.id} removed from match-queue`);
        }
        console.log(`Client ${client.id} has been disconnected`);
      });
    });
  }
}
