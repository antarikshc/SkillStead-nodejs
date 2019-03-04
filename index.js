import mongoose from 'mongoose';
import app from './server';
import UsersDAO from './src/models/users.dao';

require('dotenv').config();

// Set PORT
app.set('port', 4040);

// Create connection to Database
mongoose.createConnection(String(process.env.DB_URI), { useNewUrlParser: true })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(async (client) => {
    // We got the connection to DB, inject to DAO
    await UsersDAO.injectDB(client);

    // Proceed to listen for incoming requests
    app.listen(app.get('port'), () => {
      console.log(`Server is running on ${app.get('port')}`);
    });
  });
