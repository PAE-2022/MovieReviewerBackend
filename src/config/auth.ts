import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { UserModel } from '@models/user';
import { CreateUserDto } from '@dto/users/create-user.dto';
import { validate } from 'class-validator';
import { generateGravatarUrl } from '@utils/gravatar-gen';
import { MongoError } from 'mongodb';
import { BadRequestError, NotFoundError } from '@errors/http-error';
import config from './config';

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const userRequest = new CreateUserDto();
        Object.assign(userRequest, req.body);
        const errors = await validate(userRequest);
        if (errors.length > 0) {
          return done({ errors });
        }
        const defaultAvatar = generateGravatarUrl(userRequest.email, 256);
        const newUser = new UserModel({
          ...userRequest,
          avatar: defaultAvatar,
        });
        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        if (err instanceof MongoError && err.code === 11000) {
          return done(
            new BadRequestError(
              {
                message: 'Duplicate user',
              },
              err,
            ),
          );
        } else {
          return done(err);
        }
      }
    },
  ),
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Wrong password' });
        }

        return done(null, user, { message: 'Login successfull' });
      } catch (e) {
        return done(e);
      }
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      secretOrKey: config.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const user = await UserModel.findById(token.id);
        if (!user) {
          return done(
            new NotFoundError({
              message: 'User not found',
            }),
          );
        }
        return done(null, user);
      } catch (e) {
        done(e);
      }
    },
  ),
);
