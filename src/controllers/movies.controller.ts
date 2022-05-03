import { Movie, MovieModel } from '@models/movie';

export class MoviesController {
  async getAllMovies(): Promise<Movie[]> {
    const movies = await MovieModel.find({}).sort({ releaseDate: -1 });
    return movies;
  }
}
