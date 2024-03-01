import { Comment } from '../types/IComment';

const getCommentsByMovieId = async (movieId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URI}/comments/movie/${movieId}`);
    const data: Comment[] = await response.json();
    return data;
  } catch (error) {
    console.error('Fetching comments by movie ID failed', error);
    return [];
  }
};

const getCommentsByUserId = async (userId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URI}/comments/user/${userId}`);
    const data: Comment[] = await response.json();
    return data;
  } catch (error) {
    console.error('Fetching comments by user ID failed', error);
    return [];
  }
};

export { getCommentsByMovieId, getCommentsByUserId };
