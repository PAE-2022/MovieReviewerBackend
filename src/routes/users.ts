import config from '@config/config';
import { User } from '@models/user';
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
      const token = jwt.sign({ user: body }, config.get('JWT_SECRET'));
      return res.json({ token });
    });
  },
);

export default router;
