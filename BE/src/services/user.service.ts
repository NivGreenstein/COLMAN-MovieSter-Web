import { ObjectId, WithId } from 'mongodb';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { getDb } from '../DB/monogDb';
import { UserMongoDB, UserRegister } from '../models/user.model';
import { PartialUserUpdate } from '../controllers/user.controller';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';

const getCollection = async () => {
  const db = await getDb();
  return db.collection<UserMongoDB>('users');
};

export const updateUser = async (user: PartialUserUpdate) => {
  const collection = await getCollection();
  const updatedUser = { ...user, _id: undefined, updatedAt: new Date() };
  delete updatedUser._id;
  if (user.profilePictureUrl) {
    updatedUser.profilePictureUrl = user.profilePictureUrl;
  }

  const userBeforeUpdate = await collection.findOne({ _id: new ObjectId(user._id) });
  if (
    userBeforeUpdate &&
    !userBeforeUpdate.isGoogleUser &&
    userBeforeUpdate.profilePictureUrl &&
    userBeforeUpdate.profilePictureUrl !== user.profilePictureUrl
  ) {
    try {
      await fs.promises.unlink(userBeforeUpdate.profilePictureUrl);
    } catch (e) {
      console.error('Could not delete image', e);
    }
  }

  return await collection.updateOne({ _id: new ObjectId(user._id) }, { $set: { ...updatedUser } });
};

export const getUserById = async (id: string): Promise<WithId<UserMongoDB> | null> => {
  const collection = await getCollection();
  const user = await collection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const collection = await getCollection();
  return await collection.findOne({ email }, { projection: { password: 0 } });
};

export const createUser = async (user: UserRegister) => {
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
  const hashedPassword = bcrypt.hashSync(user.password, 10);

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

export const login = async (email: string, password: string) => {
  const collection = await getCollection();

  const user = await collection.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password!!);

  if (!isPasswordCorrect) {
    throw new Error('Password is incorrect');
  }

  const { password: _, ...userWithoutPassword } = user;
  const accessToken: string = generateAccessToken({ ...userWithoutPassword });
  const refreshToken: string = await generateRefreshToken({ ...userWithoutPassword });

  return { accessToken, refreshToken };
};

export const googleLogin = async (email: string, name: string, profilePictureUrl: string) => {
  const collection = await getCollection();

  let user: WithId<UserMongoDB> | null = await collection.findOne({ email });

  if (!user) {
    const insertion = await collection.insertOne({
      email,
      username: name,
      profilePictureUrl,
      isGoogleUser: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (insertion.acknowledged) {
      user = await collection.findOne({ email });
    }
    if (!user) {
      throw new Error('Could not create user');
    }
  }
  const accessToken: string = generateAccessToken(user);
  const refreshToken: string = await generateRefreshToken(user);

  return { accessToken, refreshToken };
};

export const deleteUser = async (id: string) => {
  const collection = await getCollection();
  return await collection.deleteOne({ _id: new ObjectId(id) });
};
