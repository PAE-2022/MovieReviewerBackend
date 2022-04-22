import { UserModel } from '@models/user';
import { Strategy as LocalStrategy } from 'passport-local';

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      const isValid = await user.verifyPassword(password);

      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);
