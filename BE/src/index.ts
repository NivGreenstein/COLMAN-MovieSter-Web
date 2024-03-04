import express from 'express';
import {config as dotenvConfig} from 'dotenv';
import helmet from 'helmet';
//@ts-ignore
import {xss} from 'express-xss-sanitizer';
import cookieParser from 'cookie-parser';
import cors, {CorsOptions} from 'cors';
import mainRouter from './routes';
import {closeMongoDbConnection, getMongoDbClient} from './DB/monogDb';

dotenvConfig();

const {PORT: serverPort} = process.env;
const app = express();
const corsOptions: CorsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200,
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
app.use(express.json({}), helmet({
    crossOriginResourcePolicy: false,
}), xss(), cors(corsOptions), cookieParser());
app.use('/', mainRouter);

app.listen(serverPort, async () => {
    await getMongoDbClient();
    console.log(`server is listening on port ${serverPort}`);
});

app.use('/uploads', express.static('uploads'));


const shutdown = async () => {
    console.log('Gracefully shutting down');
    await closeMongoDbConnection();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
