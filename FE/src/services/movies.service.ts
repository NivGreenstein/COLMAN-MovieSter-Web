import { IMovie } from '../types/IMovie';

const fetchMovieById = async (id: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URI}/movies/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: IMovie = await response.json();
    return data;
  } catch (error) {
    console.error('Fetching movie by ID failed', error);
    return null;
  }
};

const getNowPlayingMovies = async (): Promise<IMovie[]> => {
  const response = await fetch(import.meta.env.VITE_API_URI + '/movies/now-playing');
  const data: IMovie[] = await response.json();
  return data;
};

const searchMovies = async (searchValue: string): Promise<IMovie[]> => {
  const response = await fetch(import.meta.env.VITE_API_URI + '/movies/search/' + searchValue);
  const data: IMovie[] = await response.json();
  return data;
};

export { fetchMovieById, getNowPlayingMovies, searchMovies };
