import cron from 'node-cron';
import axios from 'axios';
import { IGetMovies, IMovieApiResponse } from './movies-types';
import { IPlatform, MovieModel } from '@models/movie';
import config from '@config/config';

async function getPlatformMovies(
  platform: 'netflix' | 'prime' | 'hbo',
  page = 1,
  contentType: 'movie' | 'series' = 'movie',
): Promise<IGetMovies> {
  const movies = await axios.get<IGetMovies>(
    'https://streaming-availability.p.rapidapi.com/search/basic',
    {
      params: {
        country: 'mx',
        service: platform,
        page,
        type: contentType,
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

const promiseTimeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function saveMovies() {
  console.log('Fetching movies...');
  const genres = await getGenres();

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

  const pages = 2;

  for (let i = 1; i <= pages; i++) {
    const netflixMovies = await getPlatformMovies('netflix', i);
    const primeMovies = await getPlatformMovies('prime', i);
    const hboMovies = await getPlatformMovies('hbo', i);

    const netflixSeries = await getPlatformMovies('netflix', i, 'series');
    const primeSeries = await getPlatformMovies('prime', i, 'series');
    const hboSeries = await getPlatformMovies('hbo', i, 'series');

    netflixMovies.results.forEach(addMovie);
    primeMovies.results.forEach(addMovie);
    hboMovies.results.forEach(addMovie);

    netflixSeries.results.forEach(addMovie);
    primeSeries.results.forEach(addMovie);
    hboSeries.results.forEach(addMovie);

    await promiseTimeout(1000);
  }

  console.log(movies.length);

  try {
    await MovieModel.insertMany(movies, {
      ordered: false,
    });
  } catch (e) {
    // Ignore duplicate key error
  }
  console.log('New movies saved');
}

// Every day, fetch movies APIs
cron.schedule('0 0 * * *', async () => {
  try {
    await saveMovies();
  } catch (e) {}
});
