import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '@models/user';
import config from './config';
import { IJwtToken } from './jwt';

export const facebookStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('JWT_SECRET'),
    issuer: config.get('JWT_ISSUER'),
    audience: config.get('JWT_AUDIENCE'),
  },
  async function (jwtPayload: IJwtToken, done) {
    const { id } = jwtPayload;
    const user = await UserModel.findById(id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  },
);
