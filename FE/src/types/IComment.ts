export interface IUserComment {
    movieTitle: string;
    rating: number;
    text: string;
}

export interface IMovieComment {
    username: string;
    rating: number;
    text: string;
}

export type Comment = IUserComment | IMovieComment;
