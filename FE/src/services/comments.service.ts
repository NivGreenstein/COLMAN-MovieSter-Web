import {Comment, CommentBase} from '../types/IComment';

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
        const response = await fetch(`${import.meta.env.VITE_API_URI}/comments/user/${userId}`, {credentials: 'include'});
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

const createComment = async (commentData: CommentBase, image?: File): Promise<{ _id: string } | null> => {
    const formData = new FormData();

    formData.append('description', commentData.description);
    formData.append('rating', String(commentData.rating));
    formData.append('movieId', String(commentData.movieId));
    formData.append('userId', commentData.userId);
    if (commentData.mainCommentId) {
        formData.append('mainCommentId', commentData.mainCommentId);
    }

    if (image) {
        formData.append('image', image, image.name);
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URI}/comments`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    } catch (error) {
        console.error('Creating comment with image failed', error);
        return null;
    }
};

const patchComment = async (comment: Partial<Comment>, image?: File): Promise<any | null> => {
    const formData = new FormData();

    formData.append('description', comment.description ? comment.description : '');
    formData.append('rating', String(comment.rating));
    if (comment.imagePath) {
        formData.append('imagePath', comment.imagePath);
    }
    if (image) {
        formData.append('image', image, image.name);
    }

    if (comment._id) {
        formData.append('_id', comment._id);
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URI}/comments`, {
            method: 'PATCH',
            credentials: 'include',
            body: formData,
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update comment');
        }
    } catch (error) {
        console.error('Patching comment failed', error);
        throw error;
    }
};

const deleteComment = async (id: string): Promise<Response | null> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URI}/comments/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.ok) {
            return response;
        }
        return null;
    } catch (error) {
        console.error('Deleting comment failed', error);
        return null;
    }
};

const commentsThread = async (mainCommentId: string): Promise<Comment[]> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URI}/comments/thread/${mainCommentId}`, {
            method: 'GET',
            credentials: 'include',
        });
        const data: Comment[] = await response.json();
        return data.map((comment) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
            updatedAt: new Date(comment.updatedAt),
        }));
    } catch (error) {
        console.error('Fetching comments thread failed', error);
        return [];
    }
};

export {getCommentsByMovieId, getCommentsByUserId, createComment, patchComment, deleteComment, commentsThread};
