import { ObjectId, WithId } from 'mongodb';
import bcrypt from 'bcrypt';
import { getDb } from '../DB/monogDb';
import { User } from '../models/user.model';
import { PartialUserUpdate, UserWithPassword } from '../controllers/user.controller';

const getCollection = async () => {
  const db = await getDb();
  return db.collection<User & { password: string }>('users');
};

export const updateUser = async (user: PartialUserUpdate) => {
  const collection = await getCollection();
  const updatedUser = { ...user, _id: undefined, updatedAt: new Date() };
  delete updatedUser._id;
  return await collection.updateOne({ _id: new ObjectId(user._id) }, { $set: { ...updatedUser } });
};

export const getUserById = async (id: string) => {
  const collection = await getCollection();
  const user: WithId<User> | null = await collection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const collection = await getCollection();
  return await collection.findOne({ email }, { projection: { password: 0 } });
};

export const createUser = async (user: UserWithPassword) => {
  const collection = await getCollection();

  const exsits = await collection.findOne(
    {
      $or: [{ username: user.username }, { email: user.email }],
    },
    { projection: { password: 0 } }
  );

  if (exsits) {
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const result = await collection.insertOne({
    ...user,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!result.acknowledged) {
    throw new Error('Could not create user');
  }
  return result.insertedId;
};

export const deleteUser = async (id: string) => {
  const collection = await getCollection();
  return await collection.deleteOne({ _id: new ObjectId(id) });
};
