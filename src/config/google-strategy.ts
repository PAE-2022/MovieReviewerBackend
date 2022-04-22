import { Strategy as GoogleOAuth2Strategy } from 'passport-google-oauth20';
import { UserModel } from '@models/user';
import config from './config';

export const googleStrategy = new GoogleOAuth2Strategy(
  {
    clientID: config.get('GOOGLE_CLIENT_ID'),
    clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
    callbackURL: config.get('GOOGLE_CALLBACK_URL'),
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
        googleId: id,
        profileUrl: photos === undefined ? '' : photos[0].value,
      });

      await newUser.save();
      return done(null, newUser);
    }
  },
);
