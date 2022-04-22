import { Strategy as FacebookStrategy } from 'passport-facebook';
import { UserModel } from '@models/user';
import config from './config';

export const facebookStrategy = new FacebookStrategy(
  {
    clientID: config.get('FACEBOOK_CLIENT_ID'),
    clientSecret: config.get('FACEBOOK_CLIENT_SECRET'),
    callbackURL: config.get('FACEBOOK_CALLBACK_URL'),
    profileFields: ['id', 'displayName', 'photos', 'email'],
  },
  async function (accessToken, refreshToken, profile, done) {
    const { id, displayName, emails, photos } = profile;
    if (!emails) {
      return done(null, false, { message: 'No email found' });
    }
    const email = emails[0].value;
    const user = await UserModel.findOne({ email });

    if (!user) {
      const newUser = new UserModel({
        email,
        name: displayName,
        facebookId: id,
        profileUrl: photos === undefined ? '' : photos[0].value,
      });

      try {
        await newUser.save();
        return done(null, newUser);
      } catch (e) {
        return done(e);
      }
    }
  },
);
