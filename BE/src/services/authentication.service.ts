import { getDb } from '../DB/monogDb';
import { User, UserSchema } from '../models/user.model';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

const getCollection = async () => {
	const db = await getDb();
	return db.collection('users');
};

export const register = async (user: User, password: string) => {
	UserSchema.parse(user);

	const collection = await getCollection();
	const exsits = await collection.findOne({
		$or: [{ username: user.username }, { email: user.email }],
	});

	if (exsits) {
		throw new Error('User already exists');
	}
	const hashedPassword = await bcrypt.hash(password, 10);

	const result = await collection.insertOne({
		...user,
		_id: undefined,
		password: hashedPassword,
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	if (!result.acknowledged) {
		throw new Error('Could not create user');
	}
	return result.insertedId;
};

export const login = async (username: string, password: string) => {
	const collection = await getCollection();
	const user = await collection.findOne({ username });

	if (!user) {
		throw new Error('User not found');
	}

	const isPasswordCorrect = await bcrypt.compareSync(password, user.password);

	if (!isPasswordCorrect) {
		throw new Error('Password is incorrect');
	}

	const accessToken = jsonwebtoken.sign(
		{ username: user.username, email: user.email },
		process.env.ACCESS_TOKEN_SECRET as string,
		{ expiresIn: '15m' }
	);
	const refreshToken = jsonwebtoken.sign(
		{ username: user.username, email: user.email },
		process.env.REFRESH_TOKEN_SECRET as string,
		{ expiresIn: '7d' }
	);

	return { accessToken, refreshToken };
};
