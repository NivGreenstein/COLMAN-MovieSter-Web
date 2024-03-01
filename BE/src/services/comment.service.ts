import { DeleteResult, ObjectId, UpdateResult, WithId } from 'mongodb';
import { getDb } from '../DB/monogDb';
import { Comment, CommentMongoDb } from '../models/comment.model';

const getCollection = async () => {
  const db = await getDb();
  return db.collection<CommentMongoDb>('comments');
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

export const readComment = async (commentId: string): Promise<WithId<CommentMongoDb> | null> => {
  const collection = await getCollection();
  const comment = await collection.findOne({ _id: new ObjectId(commentId) });
  return comment;
};

export const getCommentsByMovieId = async (movieId: number): Promise<WithId<CommentMongoDb>[]> => {
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { $project: { 'user.password': 0 } },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();
  return comments as WithId<CommentMongoDb>[];
};

export const getCommentsByUserId = async (userId: string): Promise<WithId<CommentMongoDb>[]> => {
  const collection = await getCollection();
  const comments = await collection.find({ userId: new ObjectId(userId) }).toArray();
  return comments;
};

export const updateComment = async (comment: Partial<WithId<Comment>>): Promise<UpdateResult<CommentMongoDb>> => {
  const collection = await getCollection();
  const data = await collection.updateOne(
    { _id: new ObjectId(comment._id) },
    {
      $set: {
        ...comment,
        userId: new ObjectId(comment.userId),
        updatedAt: new Date(),
      },
    }
  );
  return data;
};

export const deleteComment = async (commentId: string): Promise<DeleteResult> => {
  const collection = await getCollection();
  return await collection.deleteOne({ _id: new ObjectId(commentId) });
};
