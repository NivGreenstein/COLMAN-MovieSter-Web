import { DeleteResult, ObjectId, UpdateResult, WithId } from 'mongodb';
import { getDb } from '../DB/monogDb';
import { Comment, CommentMongoDb } from '../models/comment.model';
import { Movie } from '../models/movie.model';
import { fetchMovieById } from './movie.service';

const getCollection = async () => {
  const db = await getDb();
  return db.collection<CommentMongoDb>('comments');
};

export const createComment = async (comment: Comment): Promise<string | ObjectId> => {
  const collection = await getCollection();

  const searchForComment = await collection.findOne({ userId: comment.userId, movieId: comment.movieId });
  if (searchForComment) {
    throw new Error('You have already commented on this movie');
  }

  const result = await collection.insertOne({
    ...comment,
    userId: new ObjectId(comment.userId),
    mainCommentId: comment.mainCommentId ? new ObjectId(comment.mainCommentId) : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId;
};

export const readComment = async (commentId: string): Promise<WithId<CommentMongoDb> | null> => {
  const collection = await getCollection();
  const comment = await collection.findOne({ _id: new ObjectId(commentId) });
  return comment;
};

export const getCommentsByMovieId = async (movieId: number): Promise<WithId<CommentMongoDb>[]> => {
  const collection = await getCollection();
  const comments = await collection
    .aggregate([
      { $match: { movieId, mainCommentId: undefined } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { $project: { 'user.password': 0 } },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();
  return comments as WithId<CommentMongoDb>[];
};

export const getCommentsByUserId = async (userId: string): Promise<WithId<CommentMongoDb & { movie: Movie | undefined }>[]> => {
  const collection = await getCollection();
  const comments = await collection.find({ userId: new ObjectId(userId), mainCommentId: undefined }).toArray();
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const commentsWithMovies = await Promise.all(
    comments.map(async (comment) => {
      const movie = await fetchMovieById(comment.movieId);
      return { ...comment, movie };
    })
  );
  return commentsWithMovies;
};

export const getCommentsThread = async (mainCommentId: string): Promise<WithId<CommentMongoDb>[]> => {
  const collection = await getCollection();
  const comments = await collection
    .aggregate([
      { $match: { mainCommentId: new ObjectId(mainCommentId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { $project: { 'user.password': 0 } },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();
  return comments as WithId<CommentMongoDb>[];
};

export const updateComment = async (comment: Partial<WithId<Comment>>, userId: string): Promise<UpdateResult<CommentMongoDb>> => {
  const collection = await getCollection();
  const { _id, ...commentWithoutId } = comment;

  if (comment.imagePath) {
    commentWithoutId.imagePath = comment.imagePath;
  }

  const data = await collection.updateOne(
    { _id: new ObjectId(_id), userId: new ObjectId(userId) },
    {
      $set: {
        ...commentWithoutId,
        updatedAt: new Date(),
      },
    }
  );
  return data;
};

export const deleteComment = async (commentId: string, userId: string): Promise<DeleteResult> => {
  const collection = await getCollection();
  const res = await collection.deleteMany({
    $or: [
      { _id: new ObjectId(commentId), userId: new ObjectId(userId) },
      {
        mainCommentId: new ObjectId(commentId),
      },
    ],
  });
  return res;
};
