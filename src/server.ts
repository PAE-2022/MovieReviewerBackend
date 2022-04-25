import app from './app';
import '@config/config';
import '@config/mongoose';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
