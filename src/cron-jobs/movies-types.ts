export interface IGetMovies {
  results: IMovieApiResponse[];
  total_pages: number;
}

export interface IMovieApiResponse {
  imdbID: string;
  tmdbID: string;
  imdbRating: number;
  imdbVoteCount: number;
  tmdbRating: number;
  backdropPath: string;
  backdropURLs: IBackdropUrls;
  originalTitle: string;
  genres: number[];
  countries: string[];
  year: number;
  runtime: number;
  cast: string[];
  significants: string[];
  title: string;
  overview: string;
  tagline: string;
  video: string;
  posterPath: string;
  posterURLs: IPosterUrls;
  age: number;
  streamingInfo: IStreamingInfo;
  originalLanguage: string;
}

export interface IBackdropUrls {
  '1280': string;
  '300': string;
  '780': string;
  original: string;
}

export interface IPosterUrls {
  '154': string;
  '185': string;
  '342': string;
  '500': string;
  '780': string;
  '92': string;
  original: string;
}

export interface IStreamingInfo {
  netflix?: INetflix;
  prime?: IPrime;
  hbo?: IHbo;
}

export interface INetflix {
  mx: IMx;
}

export interface IPrime {
  mx: IMx;
}

export interface IHbo {
  mx: IMx;
}

export interface IMx {
  link: string;
  added: number;
  leaving: number;
}
