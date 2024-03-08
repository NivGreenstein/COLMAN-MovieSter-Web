import express from 'express';
import { config as dotenvConfig } from 'dotenv';
import fs from 'fs';
import https from 'https';

dotenvConfig();

const { PORT: serverPort, NODE_ENV } = process.env;
const app = express();

app.use((_, res, next) => {
	res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
	next();
});

app.use(express.static('/home/st111/COLMAN-MovieSter-Web/FE/dist'));

app.get('*', (_, res) => {
	res.sendFile('/home/st111/COLMAN-MovieSter-Web/FE/dist/index.html');
});

if (NODE_ENV === 'production') {
	const privateKey = fs.readFileSync(
		`${process.env.CERT_FOLDER}/client-key.pem'`,
		'utf8'
	);
	const certificate = fs.readFileSync(
		`${process.env.CERT_FOLDER}/client-cert.pem`,
		'utf8'
	);

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
