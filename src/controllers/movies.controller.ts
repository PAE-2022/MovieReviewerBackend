import { CreateCommentDto } from '@dto/movies/create-comment.dto';
import { NotFoundError } from '@errors/http-error';
import { Comment, CommentModel } from '@models/comments';
import { Movie, MovieModel } from '@models/movie';
import { UserModel } from '@models/user';

export class MoviesController {
  async getAllMovies(search: string | undefined): Promise<Movie[]> {
    if (search === undefined || search.trim().length === 0) {
      const movies = await MovieModel.find({}).sort({ releaseDate: -1 });
      return movies;
    }
    const movies = await MovieModel.find({
      $text: {
        $search: search,
      },
    }).sort({ createdAt: -1 });
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
      },
    });
    if (!movie) {
      throw new NotFoundError({
        message: 'Movie not found',
      });
    }
    return movie;
  }

  async assignScore(
    movieId: string,
    userWhoReviews: string,
    score: number,
  ): Promise<Movie> {
    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      throw new NotFoundError({
        message: 'Movie not found',
      });
    }
    // Check if the user who reviews the movie has already reviewed it
    const userAlreadyReviewed = movie.scores.findIndex(
      (score) => score.user === userWhoReviews,
    );

    let previousScore: number | undefined = undefined;

    if (userAlreadyReviewed !== -1) {
      previousScore = movie.scores[userAlreadyReviewed].score;
      movie.scores[userAlreadyReviewed].score = score;
    }

    const newScore = newAverageFromPrecomputed(
      score,
      movie.score,
      movie.scores.length,
      previousScore,
    );
    movie.score = newScore;

    movie.scores.push({
      score: score,
      user: userWhoReviews,
    });

    await movie.save();

    return movie;
  }
}

export function newAverageFromPrecomputed(
  newScore: number,
  currentAverage: number,
  containerLength: number,
  previousScore?: number,
): number {
  if (previousScore === undefined) {
    return (
      (currentAverage * containerLength + newScore) / (containerLength + 1)
    );
  } else {
    return (
      (currentAverage * containerLength - previousScore + newScore) /
      containerLength
    );
  }
}
