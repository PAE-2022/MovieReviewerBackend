import { MoviesController } from '@controllers/movies.controller';
import { User } from '@models/user';
import { authorize } from '@utils/authorize';
import { tryCatchHandler } from '@utils/route-catch';
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

export default router;
