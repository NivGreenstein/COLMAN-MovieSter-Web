import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getMongoDbClient, closeMongoDbConnection, getDb } from '../../../src/DB/monogDb';

describe('MongoDB Integration Tests', () => {
  let mongoServer: MongoMemoryServer | null | undefined;
  let connectionString: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    connectionString = mongoServer.getUri();
    process.env.MONGO_DB_URL = connectionString;
    process.env.DB_NAME = 'testdb';
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoServer.stop();
      await closeMongoDbConnection();
    }
  });

  test('Database connection is established successfully', async () => {
    const client = await getMongoDbClient();
    expect(client).toBeInstanceOf(MongoClient);

    // Check connection by attempting a simple operation
    const db = client.db('testdb');
    await expect(db.collection('test').find({}).toArray()).resolves.not.toThrow();
  });

  test('Database is accessible and correct', async () => {
    const db = await getDb();
    expect(db.databaseName).toBe('testdb');
  });

  test('Database connection closes properly', async () => {
    await closeMongoDbConnection();
    const client = await getMongoDbClient();

    // Check disconnection by attempting a simple operation
    const db = client.db('testdb');
    await expect(db.collection('test').find({}).toArray()).rejects.toThrow();
  });

  // test('Error is thrown when environment variables are missing', async () => {
  //   delete process.env.MONGO_DB_URL;
  //   delete process.env.DB_NAME;
  //   await expect(getMongoDbClient()).rejects.toThrow('MONGO_DB_URL or DB_NAME not found in .env file');
  // });
});
