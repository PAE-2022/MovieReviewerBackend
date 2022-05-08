import cron from 'node-cron';
import axios from 'axios';
import { IGetMovies, IMovieApiResponse } from './movies-types';
import { IPlatform, MovieModel } from '@models/movie';
import config from '@config/config';

async function getPlatformMovies(
  platform: 'netflix' | 'prime' | 'hbo',
): Promise<IGetMovies> {
  const movies = await axios.get<IGetMovies>(
    'https://streaming-availability.p.rapidapi.com/search/basic',
    {
      params: {
        country: 'mx',
        service: platform,
        type: 'movie',
      },
      headers: {
        'X-RapidAPI-Key': config.get('RAPID_API_KEY'),
      },
    },
  );

  return movies.data;
}

async function getGenres(): Promise<Record<string, string>> {
  const genres = await axios.get<Record<string, string>>(
    'https://streaming-availability.p.rapidapi.com/genres',
    {
      headers: {
        'X-RapidAPI-Key': config.get('RAPID_API_KEY'),
      },
    },
  );

  return genres.data;
}

interface IMovieData {
  name: string;
  cover: string;
  synopsis: string;
  trailer: string;
  score: number;
  releaseDate: number;
  platforms: IPlatform[];
  screenwriters: string[];
  cast: string[];
  genres: string[];
}

export async function saveMovies() {
  const genres = await getGenres();
  const netflixMovies = await getPlatformMovies('netflix');
  const primeMovies = await getPlatformMovies('prime');
  const hboMovies = await getPlatformMovies('hbo');

  const movies: IMovieData[] = [];

  const addMovie = (movie: IMovieApiResponse) => {
    if (!movie.posterURLs.original || !movie.overview || !movie.title) {
      return;
    }
    const platforms: IPlatform[] = [];
    if (movie.streamingInfo.netflix) {
      platforms.push({
        name: 'netflix',
        url: movie.streamingInfo.netflix.mx.link,
      });
    }
    if (movie.streamingInfo.hbo) {
      platforms.push({
        name: 'hbo',
        url: movie.streamingInfo.hbo.mx.link,
      });
    }
    if (movie.streamingInfo.prime) {
      platforms.push({
        name: 'prime',
        url: movie.streamingInfo.prime.mx.link,
      });
    }
    const releaseYear = movie.year;
    MovieModel.create();
    movies.push({
      name: movie.title,
      cover: movie.posterURLs.original,
      synopsis: movie.overview,
      releaseDate: releaseYear,
      platforms: platforms,
      trailer:
        movie.video === ''
          ? null
          : `https://www.youtube.com/embed/${movie.video}`,
      cast: movie.cast,
      screenwriters: movie.significants,
      genres: movie.genres.map((genre) => genres[genre.toString()]),
      score: 0,
    });
  };

  netflixMovies.results.forEach(addMovie);
  primeMovies.results.forEach(addMovie);
  hboMovies.results.forEach(addMovie);

  try {
    await MovieModel.insertMany(movies, {
      ordered: false,
    });
  } catch (e) {
    // Ignore duplicate key error
  }
}

// Every day, fetch movies APIs
/*cron.schedule('0 0 * * *', async () => {
  await saveMovies();
});*/

saveMovies();
