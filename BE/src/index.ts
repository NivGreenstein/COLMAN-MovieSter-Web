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

app.use('/', mainRouter);

if (NODE_ENV === 'production') {
  const privateKey = fs.readFileSync(`${process.env.CERT_FOLDER}/client-key.pem`, 'utf8');
  const certificate = fs.readFileSync(`${process.env.CERT_FOLDER}/client-cert.pem`, 'utf8');

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

export default app;
