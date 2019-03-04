import express from 'express';
import bodyParser from 'body-parser';
import users from './src/api/user.route';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register API routes
app.use('/users', users);
app.get('/', (req, res) => { res.send('Welcome to SkillStead API'); });
app.use('*', (req, res) => res.status(404).json({ error: 'You seem lost a bit lost' }));

export default app;
