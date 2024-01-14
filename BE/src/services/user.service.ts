import { getDb } from '../DB/monogDb';
import { ObjectId } from 'mongodb';
import { User } from '../models/user.model';

const getCollection = async () => {
	const db = await getDb();
	return db.collection('users');
};

export const updateUser = async (user: User) => {
	const collection = await getCollection();
	return await collection.updateOne(
		{ _id: new ObjectId(user._id) },
		{ $set: { ...user } }
	);
};
