import { MoviesController } from '@controllers/movies.controller';
import { CreateCommentDto } from '@dto/movies/create-comment.dto';
import { RateMovieDto } from '@dto/movies/rate-movie.dto';
import { User } from '@models/user';
import { authorize } from '@utils/authorize';
import { tryCatchHandler } from '@utils/route-catch';
import { validate } from '@utils/validate';
import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/movies:
 *  get:
 *   description: Get all movies
 *   parameters:
 *     - in: query
 *       name: query
 *       required: false
 *       description: query
 *       schema:
 *         type: string
 *   responses:
 *    200:
 *      description: A successful response
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Movie'
 *   tags:
 *    - movies
 *   produces:
 *    - application/json
 */
router.get(
  '/',
  tryCatchHandler(async (req, res) => {
    const controller = new MoviesController();
    const movies = await controller.getAllMovies(
      req.query.query as string | undefined,
    );
    res.json(movies);
  }),
);

/**
 * @swagger
 * /api/movies/{id}:
 *  get:
 *   description: Get all movies
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: Movie id
 *      schema:
 *        type: string
 *   responses:
 *    200:
 *      description: A successful response
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Movie'
 *   tags:
 *    - movies
 *   produces:
 *    - application/json
 */
router.get(
  '/:id',
  authorize(),
  tryCatchHandler(async (req, res) => {
    const { id: userId } = req.user as User;
    const { id: movieId } = req.params;
    const controller = new MoviesController();
    const movie = await controller.getMovieById(userId, movieId);
    res.json(movie);
  }),
);

/**
 * @swagger
 * /api/movies/{id}/comment:
 *  post:
 *   description: Get all movies
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: Movie id
 *      schema:
 *        type: string
 *   requestBody:
 *     description: Comment content
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/CreateCommentDto'
 *   responses:
 *    200:
 *      description: A successful response
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Comment'
 *   tags:
 *    - movies
 *   produces:
 *    - application/json
 */
router.post(
  '/:id/comment',
  authorize(),
  validate(CreateCommentDto),
  tryCatchHandler(async (req, res) => {
    const controller = new MoviesController();
    const { id: userId } = req.user as User;
    const commentContent = req.body as CreateCommentDto;
    const comment = await controller.addComment(
      req.params.id,
      userId,
      commentContent,
    );
    res.status(201).json(comment);
  }),
);

/**
 * @swagger
 * /api/movies/{id}/rate:
 *  post:
 *   description: Rate a movie
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: Movie id
 *      schema:
 *        type: string
 *   requestBody:
 *     description: Rate content
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/RateMovieDto'
 *   responses:
 *    200:
 *      description: A successful response
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Movie'
 *   tags:
 *    - movies
 *   produces:
 *    - application/json
 */
router.post(
  '/:id/rate',
  authorize(),
  validate(RateMovieDto),
  tryCatchHandler(async (req, res) => {
    const controller = new MoviesController();
    const { id: userId } = req.user as User;
    const { id: movieId } = req.params;
    const { score } = req.body as RateMovieDto;

    const movie = await controller.assignScore(movieId, userId, score);
    res.status(201).json(movie);
  }),
);

export default router;
