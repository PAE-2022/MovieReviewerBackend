import { MoviesController } from '@controllers/movies.controller';
import { RateMovieDto } from '@dto/movies/rate-movie.dto';
import { User } from '@models/user';
import { authorize } from '@utils/authorize';
import { tryCatchHandler } from '@utils/route-catch';
import { validate } from '@utils/validate';
import { Router } from 'express';

const router = Router();

router.get(
  '/',
  tryCatchHandler(async (req, res) => {
    const controller = new MoviesController();
    const movies = await controller.getAllMovies();
    res.json(movies);
  }),
);

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

router.post(
  '/:id/comment',
  authorize(),
  tryCatchHandler(async (req, res) => {
    const controller = new MoviesController();
    const { id: userId } = req.user as User;
    const comment = await controller.addComment(
      req.params.id,
      userId,
      req.body.comment,
    );
    res.status(201).json(comment);
  }),
);

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
