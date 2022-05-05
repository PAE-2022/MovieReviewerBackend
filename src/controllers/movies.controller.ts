import { CreateCommentDto } from '@dto/movies/create-comment.dto';
import { NotFoundError } from '@errors/http-error';
import { Comment, CommentModel } from '@models/comments';
import { Movie, MovieModel } from '@models/movie';
import { UserModel } from '@models/user';

export class MoviesController {
  async getAllMovies(): Promise<Movie[]> {
    const movies = await MovieModel.find({}).sort({ releaseDate: -1 });
    return movies;
  }

  async addComment(
    id: string,
    userId: string,
    comment: CreateCommentDto,
  ): Promise<Comment> {
    const movie = await MovieModel.findById(id);
    if (!movie) {
      throw new NotFoundError({
        message: 'Movie not found',
      });
    }
    const newComment = await CommentModel.create({
      belongsTo: movie._id,
      createdBy: userId,
      content: comment.comment,
    });
    movie.comments.push(newComment);
    await movie.save();
    return newComment;
  }

  async getMovieById(currentUserId: string, id: string): Promise<Movie> {
    const user = await UserModel.findById(currentUserId);

    // we do this because we want to get the movie with all the comments from the current user and the comments from the other users
    const followingPlusSelf = [...user.following, user._id];
    const movie = await MovieModel.findById(id).populate({
      path: 'comments',
      // Only retrieve comments for the following users:
      match: {
        createdBy: {
          $in: followingPlusSelf,
        },
      },
      populate: {
        path: 'createdBy',
        select: 'name',
      },
    });
    if (!movie) {
      throw new NotFoundError({
        message: 'Movie not found',
      });
    }
    return movie;
  }
}
