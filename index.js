import app from './server';

// Set PORT
app.set('port', 4040);

app.listen(app.get('port'), () => {
  console.log(`Server is running on ${app.get('port')}`);
});
