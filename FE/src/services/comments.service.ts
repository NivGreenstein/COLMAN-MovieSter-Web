import { Comment } from '../types/IComment';

const getCommentsByMovieId = async (movieId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URI}/comments/movie/${movieId}`, {
      credentials: 'include',
    });
    const data: Comment[] = await response.json();
    return data.map((comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    }));
  } catch (error) {
    console.error('Fetching comments by movie ID failed', error);
    return [];
  }
};

const getCommentsByUserId = async (userId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URI}/comments/user/${userId}`, { credentials: 'include' });
    const data: Comment[] = await response.json();
    return data.map((comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    }));
  } catch (error) {
    console.error('Fetching comments by user ID failed', error);
    return [];
  }
};

export { getCommentsByMovieId, getCommentsByUserId };
