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

router.post(
  '/:id/comment',
  authorize(),
  tryCatchHandler(async (req, res) => {
    const controller = new MoviesController();
    const { _id: userId } = req.user as User;
    const comment = await controller.addComment(
      req.params.id,
      userId,
      req.body.comment,
    );
    res.json(comment);
  }),
);

export default router;
