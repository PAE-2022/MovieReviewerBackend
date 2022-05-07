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
    if (userAlreadyReviewed !== -1) {
      const previousScore = movie.scores[userAlreadyReviewed].score;
      // If the user has already reviewed the movie, we update the score
      movie.scores[userAlreadyReviewed].score = score;

      // Update the average score
      const newAverageScore =
        (movie.score * movie.scores.length - previousScore + score) /
        movie.scores.length;
      movie.score = newAverageScore;
    } else {
      movie.scores.push({
        score: score,
        user: userWhoReviews,
      });
      // This is the average score calculation
      // This is an optimization to avoid calculating
      // the average score everytime we want to get the average score
      const newAverageScore =
        (movie.score * movie.scores.length + score) / (movie.scores.length + 1);
      movie.score = newAverageScore;
    }

    await movie.save();

    return movie;
  }
}
