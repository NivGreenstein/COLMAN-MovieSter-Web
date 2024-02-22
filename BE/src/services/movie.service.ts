import { Movie } from '../models/movie.model';
import axios from 'axios';

const authKey =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMzNhMWI1ZGRhYWM3NGE3Yjk1NGZmNTQyZjQ0YWUzOCIsInN1YiI6IjY1YTI5Zjc3ZTljMGRjMDEyOWE0MmU5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MTTRjbXArp88CLukCuqVUfZNRnpnVP3t8hwak166lw4';
let successfulAuthentication = false;
const baseUrl = 'https://api.themoviedb.org/3';
const posterBaseUrl = 'https://image.tmdb.org/t/p/original';

const movieServerUrls = {
  authentication: `${baseUrl}/authentication`,
  nowPlayingMovies: (page: number) => `${baseUrl}/movie/now_playing?language=en-US&page=${page}`,
  searchMovie: (movieName: string) => `${baseUrl}/search/movie?query=${movieName}&include_adult=true&page=1`,
  movieById: (movieId: number) => `${baseUrl}/movie/${movieId}?language=en-US`,
};

interface MoviesApiResponse {
  page: number;
  results: MoviesResponse[];
  total_pages: number;
}

interface MoviesResponse {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
}

const headers = () => {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${authKey}`,
  };
};

const posterUrl = (posterPath: string): string => {
  return `${posterBaseUrl}/${posterPath}`;
};

const fetchAuthentication = async (): Promise<void> => {
  if (successfulAuthentication) return;

  const response = await axios.get(movieServerUrls.authentication, {
    headers: headers(),
  });

  successfulAuthentication = response.status === 200;
};

export const fetchNowPlayingMovies = async (page: number): Promise<Array<Movie>> => {
  await fetchAuthentication();

  const response = await axios.get(movieServerUrls.nowPlayingMovies(page), {
    headers: headers(),
  });

  if (response.status === 200) {
    const apiResponse = response.data as MoviesApiResponse;
    return apiResponse.results.map((movieResponse) => ({
      id: movieResponse.id,
      title: movieResponse.title,
      description: movieResponse.overview,
      posterUrl: posterUrl(movieResponse.poster_path),
      rating: movieResponse.vote_average,
    }));
  } else {
    return [];
  }
};

export async function fetchMovieDataByName(movieName: string): Promise<Movie[]> {
  await fetchAuthentication();

  const response = await axios.get(movieServerUrls.searchMovie(movieName), {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${authKey}`,
    },
  });

  if (response.status === 200) {
    const apiResponse = response.data as MoviesApiResponse;
    return apiResponse.results.map((movieResponse) => ({
      id: movieResponse.id,
      title: movieResponse.title,
      description: movieResponse.overview,
      posterUrl: posterUrl(movieResponse.poster_path),
      rating: movieResponse.vote_average,
    }));
  } else {
    return [];
  }
}

export const fetchMovieById = async (movieId: number): Promise<Movie | undefined> => {
  await fetchAuthentication();

  const response = await axios.get(movieServerUrls.movieById(movieId), {
    headers: headers(),
  });

  if (response.status === 200) {
    const movieResponse = response.data as MoviesResponse;
    return {
      id: movieResponse.id,
      title: movieResponse.title,
      description: movieResponse.overview,
      posterUrl: posterUrl(movieResponse.poster_path),
      rating: movieResponse.vote_average,
    };
  } else {
    return undefined;
  }
};
