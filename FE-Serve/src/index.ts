import express from 'express';
import { config as dotenvConfig } from 'dotenv';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
//@ts-ignore
import { xss } from 'express-xss-sanitizer';
import cors, { CorsOptions } from 'cors';

dotenvConfig();

const { PORT: serverPort, NODE_ENV } = process.env;
const app = express();
const corsOptions: CorsOptions = {
	origin: '*',
};

app.use(express.static('/home/st111/COLMAN-MovieSter-Web/FE/dist'));

app.get('*', (req, res) => {
	res.sendFile('/home/st111/COLMAN-MovieSter-Web/FE/dist/index.html');
});

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
		console.log(`HTTPS Server running on port ${serverPort}`);
	});
} else {
	app.listen(serverPort, async () => {
		console.log(`HTTP Server running on port ${serverPort}`);
	});
}

export default app;
