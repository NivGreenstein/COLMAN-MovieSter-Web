import express from 'express';
import { config as dotenvConfig } from 'dotenv';
import helmet from 'helmet';
import https from 'https';
import fs from 'fs';
//@ts-ignore
import { xss } from 'express-xss-sanitizer';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import mainRouter from './routes';
import { closeMongoDbConnection, getMongoDbClient } from './DB/monogDb';

dotenvConfig();

const { PORT: serverPort, NODE_ENV } = process.env;
const app = express();
const corsOptions: CorsOptions = {
  origin: [
    'http://node60.cs.colman.ac.il',
    'http://193.106.55.220',
    'https://node60.cs.colman.ac.il',
    'https://193.106.55.220',
    'http://localhost:3000',
    'http://localhost:4200',
    'http://localhost:5173',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(
  express.json({}),
  helmet({
    crossOriginResourcePolicy: false,
  }),
  xss(),
  cors(corsOptions),
  cookieParser()
);
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

app.use('/', mainRouter);

if (NODE_ENV === 'production') {
  const privateKey = fs.readFileSync('../cert/client-key.pem', 'utf8');
  const certificate = fs.readFileSync('../cert/client-cert.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    requestCert: false,
    rejectUnauthorized: false,
  };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(serverPort, async () => {
    await getMongoDbClient();
    console.log(`HTTPS Server running on port ${serverPort}`);
  });
} else {
  app.listen(serverPort, async () => {
    await getMongoDbClient();
    console.log(`HTTP Server running on port ${serverPort}`);
  });
}

const shutdown = async () => {
  console.log('Gracefully shutting down');
  await closeMongoDbConnection();
};

// process.on('SIGTERM', shutdown);
// process.on('SIGINT', shutdown);

export default app;
