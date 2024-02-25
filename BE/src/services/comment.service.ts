import { DeleteResult, ObjectId, UpdateResult, WithId } from 'mongodb';
import { getDb } from '../DB/monogDb';
import { Comment } from '../models/comment.model';

const getCollection = async () => {
  const db = await getDb();
  return db.collection<Comment>('comments');
};

export const createComment = async (comment: Comment): Promise<string | ObjectId> => {
  const collection = await getCollection();
  const result = await collection.insertOne({
    ...comment,
    userId: new ObjectId(comment.userId),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId;
};

export const readComment = async (commentId: string): Promise<WithId<Comment> | null> => {
  const collection = await getCollection();
  const comment = await collection.findOne({ _id: new ObjectId(commentId) });
  return comment;
};

export const getCommentsByMovieId = async (movieId: number): Promise<WithId<Comment>[]> => {
  const collection = await getCollection();
  const comments = await collection
    .aggregate([
      { $match: { movieId } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();
  return comments as WithId<Comment>[];
};

export const getCommentsByUserId = async (userId: string): Promise<WithId<Comment>[]> => {
  const collection = await getCollection();
  const comments = await collection.find({ userId: new ObjectId(userId) }).toArray();
  return comments;
};

export const updateComment = async (comment: Partial<Comment>): Promise<UpdateResult<Comment>> => {
  const collection = await getCollection();
  return await collection.updateOne(
    { _id: new ObjectId(comment._id) },
    {
      $set: {
        ...comment,
        userId: new ObjectId(comment.userId),
        updatedAt: new Date(),
      },
    }
  );
};

export const deleteComment = async (commentId: string): Promise<DeleteResult> => {
  const collection = await getCollection();
  return await collection.deleteOne({ _id: new ObjectId(commentId) });
};
