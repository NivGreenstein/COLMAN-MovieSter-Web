import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
config();

let mongodbClient: MongoClient;

const initDbConnection = async () => {
	const { MONGO_DB_URL: connectionString = '', DB_NAME: dbName = '' } =
		process.env;
	if (!connectionString || !dbName) {
		throw new Error('MONGO_DB_URL or DB_NAME not found in .env file');
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

export const getDb = async () => {
	const db = await getMongoDbClient();
	const { DB_NAME: dbName = '' } = process.env;
	return db.db(dbName);
};

export const closeMongoDbConnection = async () => {
	if (mongodbClient) {
		await mongodbClient.close();
	}
};
