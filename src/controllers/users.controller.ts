import { NotFoundError } from '@errors/http-error';
import { MovieModel } from '@models/movie';
import { UserModel } from '@models/user';

export class UserController {
  async addMovieToFavorites(userId: string, movieId: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError({
        message: 'User not found',
      });
    }
    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      throw new NotFoundError({
        message: 'Movie not found',
      });
    }
    user.favorites.push(movie._id);
    await user.save();
  }

  async removeMovieFromFavorites(userId: any, movieId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError({
        message: 'User not found',
      });
    }

    await user.updateOne({
      $pull: {
        favorites: movieId,
      },
    });
  }
}
