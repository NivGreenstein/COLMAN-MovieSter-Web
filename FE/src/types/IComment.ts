export interface IUserComment {
    movieTitle: string;
    rating: number;
    text: string;
    date: string | Date;
}

export interface IMovieComment {
    username: string;
    rating: number;
    text: string;
    date: string | Date;
}


export type Comment = IUserComment | IMovieComment;
