import socket from 'socket.io';

let io;

export default class SocketController {
  /**
   * Create and start listening Socket connection
   * @param {Server} server
   */
  static async startSocket(server) {
    io = socket(server);

    io.on('connection', (client) => {
      console.log(`Client ${client.id} has been connected`);

      client.on('disconnect', () => {
        console.log(`Client ${client.id} has been disconnected`);
      });
    });
  }
}
