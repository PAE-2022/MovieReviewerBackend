import config from '@config/config';
import { GcpFile, multerFileUploadHandler } from '@config/multer';
import { UserController } from '@controllers/users.controller';
import { AddToFavoritesDto } from '@dto/users/add-to-favorites.dto';
import { CreateUserDto } from '@dto/users/create-user.dto';
import { FollowDto } from '@dto/users/follow.dto';
import { ModifyUserDto } from '@dto/users/modifiy-user.dto';
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
 * /api/users/search:
 *  get:
 *   description: Get user by id
 *   parameters:
 *    - in: query
 *      name: query
 *      required: true
 *      description: query to search
 *      schema:
 *        type: string
 *   responses:
 *    200:
 *      description: A successful response
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/User'
 *   tags:
 *    - users
 *   produces:
 *    - application/json
 */
router.get(
  '/search',
  authorize(),
  tryCatchHandler(async (req, res) => {
    const controller = new UserController();
    const { query } = req.query;
    if (!query) {
      res.status(400).json({
        message: 'Query is required',
      });
      return;
    }
    const users = await controller.searchUsers(query as string);
    res.json(users);
  }),
);

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
  validate(CreateUserDto),
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

/**
 * @swagger
 * /api/users:
 *  patch:
 *   description: Modify user
 *   requestBody:
 *     description: Modify user dto
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ModifyUserDto'
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
router.patch(
  '/',
  validate(ModifyUserDto),
  authorize(),
  tryCatchHandler(async (req, res) => {
    const { id: userId } = req.user as User;
    const modifyUserRequest = req.body as ModifyUserDto;

    const controller = new UserController();
    await controller.modifyUser(userId, modifyUserRequest);
    res.status(200).json({
      message: 'User modified',
    });
  }),
);

/**
 * @swagger
 * /api/users/upload-profile:
 *  post:
 *   description: Upload profile picture
 *   requestBody:
 *     description: Upload profile picture dto
 *     required: true
 *     content:
 *       multipart/form-data:
 *         schema:
 *           type: object
 *           properties:
 *             picture:
 *               type: string
 *               format: binary
 *               description: Profile picture
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
  '/upload-profile',
  authorize(),
  multerFileUploadHandler.single('picture'),
  tryCatchHandler(async (req, res) => {
    const { id: userId } = req.user as User;
    const { file } = req;
    const controller = new UserController();

    await controller.uploadProfilePicture(userId, file as GcpFile);

    res.status(200).json({
      message: 'Profile picture uploaded',
    });
  }),
);

/**
 * @swagger
 * /api/users/{id}/comments:
 *  get:
 *   description: Get logged in user comments
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
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/CommentDto'
 *   tags:
 *    - users
 *   produces:
 *    - application/json
 */
router.get(
  '/:id/comments',
  authorize(),
  tryCatchHandler(async (req, res) => {
    const userId = req.params.id;
    const controller = new UserController();
    const comments = await controller.getUserComments(userId);
    res.json(comments);
  }),
);

export default router;
