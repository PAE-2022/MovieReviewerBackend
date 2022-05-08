import config from '@config/config';
import { UserController } from '@controllers/users.controller';
import { AddToFavoritesDto } from '@dto/users/add-to-favorites.dto';
import { FollowDto } from '@dto/users/follow.dto';
import { User } from '@models/user';
import { authorize } from '@utils/authorize';
import { tryCatchHandler } from '@utils/route-catch';
import { validate } from '@utils/validate';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = Router();

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *   description: Get user by id
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: user id
 *      schema:
 *        type: string
 *   responses:
 *    200:
 *      description: A successful response
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *   tags:
 *    - users
 *   produces:
 *    - application/json
 */
router.get(
  '/:id',
  //authorize(),
  tryCatchHandler(async (req, res) => {
    const { id: userId } = req.params;
    const controller = new UserController();
    const user = await controller.getUserById(userId);
    res.json(user);
  }),
);

/**
 * @swagger
 * /api/users/signup:
 *  post:
 *   description: Signup user
 *   requestBody:
 *     description: Create user dto
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/CreateUserDto'
 *   responses:
 *    201:
 *      description: A successful response
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *   tags:
 *    - users
 *   produces:
 *    - application/json
 */
router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res) => {
    res.json({
      message: 'User created',
    });
  },
);

/**
 * @swagger
 * /api/users/login:
 *  post:
 *   description: login user
 *   requestBody:
 *     description: Create user dto
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *   responses:
 *    200:
 *      description: A successful response
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *   tags:
 *    - users
 *   produces:
 *    - application/json
 */
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

/**
 * @swagger
 * /api/users/favorites:
 *  post:
 *   description: Add movie to favorites
 *   requestBody:
 *     description: Add to favorites dto
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/AddToFavoritesDto'
 *   responses:
 *    200:
 *      description: A successful response
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *   tags:
 *    - users
 *   produces:
 *    - application/json
 */
router.post(
  '/favorites',
  validate(AddToFavoritesDto),
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

/**
 * @swagger
 * /api/users/favorites/{id}:
 *  delete:
 *   description: Delete movie from favorites
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: favorite movie id
 *      schema:
 *        type: string
 *   responses:
 *    200:
 *      description: A successful response
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *   tags:
 *    - users
 *   produces:
 *    - application/json
 */
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

/**
 * @swagger
 * /api/users/followers:
 *  post:
 *   description: Add user to followers
 *   requestBody:
 *     description: Add to followers dto
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/FollowDto'
 *   responses:
 *    201:
 *      description: A successful response
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *   tags:
 *    - users
 *   produces:
 *    - application/json
 */
router.post(
  '/followers',
  validate(FollowDto),
  authorize(),
  tryCatchHandler(async (req, res) => {
    const { id: userId } = req.user as User;
    const { userId: followId } = req.body as FollowDto;

    const controller = new UserController();
    await controller.addFollow(userId, followId);
    res.status(201).json({
      message: 'Movie added to favorites',
    });
  }),
);

export default router;
