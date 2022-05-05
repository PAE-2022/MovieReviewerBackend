import mongoose from 'mongoose';
import config from './config';

mongoose.connect(config.get('MONGO_URL'), (err) => {
  if (err) {
    console.error(err);
  }
});
