const CERT_FOLDER = '/home/st111/COLMAN-MovieSter-Web/cert';

module.exports = {
	apps: [
		{
			name: 'BE',
			script: './BE/dist/index.js',
			env_production: {
				NODE_ENV: 'production',
				PORT: 4000,
				MONGO_DB_URL:
					'mongodb://server:123123123@localhost:21771/moviester',
				DB_NAME: 'moviester',
				ACCESS_TOKEN_SECRET: 'abc123',
				REFRESH_TOKEN_SECRET: 'cbd321',
				GOOGLE_CLIENT_ID:
					'286438240561-re2j2jr85ba3m8jlv585fooa3kpun6u2.apps.googleusercontent.com',
				GOOGLE_CLIENT_SECRET: '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',
				CERT_FOLDER,
			},
		},
		{
			name: 'FE',
			script: './FE-Serve/dist/index.js',
			env_production: {
				NODE_ENV: 'production',
				PORT: 443,
				CERT_FOLDER,
			},
		},
	],
};
