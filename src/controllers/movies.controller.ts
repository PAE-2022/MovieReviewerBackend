import { CreateCommentDto } from '@dto/movies/create-comment.dto';
import { NotFoundError } from '@errors/http-error';
import { Comment, CommentModel } from '@models/comments';
import { Movie, MovieModel } from '@models/movie';

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
}
