import { ObjectId, UpdateResult } from 'mongodb';
import jwt from 'jsonwebtoken';
import { getDb } from '../DB/monogDb';
import { RefreshToken } from '../models/refreshToken.model';
import { verifyRefreshTokenWithSecret } from '../utils/jwt.util';

const getCollection = async () => {
  const db = await getDb();
  return db.collection<RefreshToken>('refreshTokens');
};

export const createRefreshToken = async (jwtToken: string, userId: string | ObjectId, expiresAt: Date): Promise<string | ObjectId> => {
  const collection = await getCollection();
  collection.updateMany({ userId: new ObjectId(userId) }, { $set: { revoked: true } });

  const result = await collection.insertOne({
    token: jwtToken,
    userId: new ObjectId(userId),
    revoked: false,
    createdAt: new Date(),
    expiresAt,
  });

  if (result.acknowledged === false) throw new Error('Failed to create refresh token');
  return jwtToken;
};

export const findRefreshToken = async (token: string): Promise<RefreshToken | null> => {
  const collection = await getCollection();
  return collection.findOne({ token });
};

export const revokeRefreshToken = async (token: string): Promise<UpdateResult> => {
  const collection = await getCollection();
  return collection.updateOne({ token }, { $set: { revoked: true } });
};

export const verifyRefreshToken = async (token: string): Promise<boolean> => {
  const collection = await getCollection();
  const refreshToken = await collection.findOne({ token });

  if (!refreshToken || refreshToken.revoked || refreshToken.expiresAt < new Date() || !verifyRefreshTokenWithSecret(token)) {
    return false;
  }

  return true;
};
