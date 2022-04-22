import passport from 'passport';
import { facebookStrategy } from './facebook-strategy';
import { googleStrategy } from './google-strategy';
import { localStrategy } from './local-strategy';

passport.use(localStrategy);
passport.use(googleStrategy);
//passport.use(facebookStrategy);
