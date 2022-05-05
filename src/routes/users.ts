import config from '@config/config';
import { UserController } from '@controllers/users.controller';
import { AddToFavoritesDto } from '@dto/users/add-to-favorites.dto';
import { User } from '@models/user';
import { authorize } from '@utils/authorize';
import { tryCatchHandler } from '@utils/route-catch';
import { validate } from '@utils/validate';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = Router();

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res) => {
    res.json({
      message: 'User created',
    });
  },
);

router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  async (req, res, next) => {
    const user = req.user as User | undefined;
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }
    req.login(user, { session: false }, async (err) => {
      if (err) return next(err);
      const body = { _id: user._id, email: user.email };
      const token = jwt.sign(
        { id: body._id, email: body.email },
        config.get('JWT_SECRET'),
        {
          expiresIn: '30d',
        },
      );
      return res.json({ token });
    });
  },
);

router.post(
  '/favorites',
  validate<AddToFavoritesDto>(AddToFavoritesDto),
  authorize(),
  tryCatchHandler(async (req, res) => {
    const { id: userId } = req.user as User;
    const { movieId } = req.body as AddToFavoritesDto;

    const controller = new UserController();
    await controller.addMovieToFavorites(userId, movieId);
    res.json({
      message: 'Movie added to favorites',
    });
  }),
);

router.delete(
  '/favorites/:id',
  authorize(),
  tryCatchHandler(async (req, res) => {
    const { id: userId } = req.user as User;
    const { id: movieId } = req.params;

    const controller = new UserController();
    await controller.removeMovieFromFavorites(userId, movieId);
    res.json({
      message: 'Movie removed from favorites',
    });
  }),
);

export default router;
