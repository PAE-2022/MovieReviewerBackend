import { MoviesController } from '@controllers/movies.controller';
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

export default router;
