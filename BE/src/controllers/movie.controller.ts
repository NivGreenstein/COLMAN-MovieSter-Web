import { RequestHandler } from 'express';
import httpCode from 'http-status-codes';
import { Movie } from '../models/movie.model';
import * as service from '../services/movie.service';
import { ErrorResponse } from '../Globals';

type GetNowPlayingMovies = RequestHandler<undefined, Movie[] | ErrorResponse, undefined, { page: string }>;
type GetMovieById = RequestHandler<{ movieId: string }, Movie | ErrorResponse>;
type SearchMovieByName = RequestHandler<{ movieName: string }, Movie[] | ErrorResponse>;

export const getNowPlayingMovies: GetNowPlayingMovies = async (req, res) => {
  const { page = '1' } = req.query;

  if (isNaN(parseInt(page))) {
    return res.status(httpCode.BAD_REQUEST).json({ message: 'Page should be a number' });
  }

  try {
    const movies = await service.fetchNowPlayingMovies(parseInt(page));
    return res.status(httpCode.OK).json(movies);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
    return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const getMovieById: GetMovieById = async (req, res) => {
  const { movieId = '' } = req.params;

  if (!movieId) {
    return res.status(httpCode.BAD_REQUEST).json({ message: 'Movie id is required' });
  }

  if (movieId.match(/\D/)) {
    return res.status(httpCode.BAD_REQUEST).json({ message: 'Movie id should be a number' });
  }

  try {
    const movie = await service.fetchMovieById(parseInt(movieId));
    return res.status(httpCode.OK).json(movie);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
    return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const searchMovieByName: SearchMovieByName = async (req, res) => {
  const { movieName = '' } = req.params;

  if (!movieName) {
    return res.status(httpCode.BAD_REQUEST).json({ message: 'Movie name is required' });
  }

  try {
    const movies = await service.fetchMovieDataByName(movieName);
    return res.status(httpCode.OK).json(movies);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
    return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
