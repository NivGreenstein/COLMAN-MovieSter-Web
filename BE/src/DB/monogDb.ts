import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
config();

let mongodbClient: MongoClient | null = null;

const initDbConnection = async () => {
	const { MONGO_DB_URL: connectionString = '' } = process.env;
	if (!connectionString) {
		throw new Error('MONGO_DB_URL not found in .env file');
	}
	const client = new MongoClient(connectionString);

	client.on('serverClosed', () =>
		console.log('live connection server closed')
	);

	client.on('open', () =>
		console.log('live connection to the database opened')
	);
	client.on('close', () =>
		console.log('live connection to the database closed')
	);
	client.on('error', (err) =>
		console.log('live connection to the database errored out', err)
	);

	mongodbClient = await client.connect();
};

export const getMongoDbClient = async () => {
	if (mongodbClient) {
		return mongodbClient;
	}
	await initDbConnection();
	return mongodbClient;
};

export const closeMongoDbConnection = async () => {
	if (mongodbClient) {
		await mongodbClient.close();
	}
};
