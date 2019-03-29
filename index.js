import mongoose from 'mongoose';
import app from './server';
import UsersDAO from './src/models/users.dao';
import CategoryDAO from './src/models/category.dao';
import QuestionDAO from './src/models/question.dao';
import SocketController from './src/game/main.socket';
import MatchDAO from './src/models/match.dao';
import RedisClient from './src/game/redis.client';

require('dotenv').config();

// Set PORT
app.set('port', 4040);

// Create connection to Database
mongoose.createConnection(
  String(process.env.DB_URI),
  {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true
  }
)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(async (client) => {
    console.log('Connection established: MongoDB');
    // We got the connection to DB, inject to DAO
    await UsersDAO.injectDB(client);
    await CategoryDAO.injectDB(client);
    await QuestionDAO.injectDB(client);
    await MatchDAO.injectDB(client);

    await RedisClient.init();

    // Proceed to listen for incoming requests
    const server = app.listen(app.get('port'), () => {
      console.log(`Server is running on ${app.get('port')}`);
    });

    await SocketController.startSocket(server);
  });
