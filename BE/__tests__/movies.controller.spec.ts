import request from 'supertest';
import express from 'express';
import axios from 'axios';
import router from './../src/routes/movie.router';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


const app = express();
app.use(express.json());
app.use(router);

describe('Movie API', () => {
    it('GET /now-playing - success', async () => {
        (mockedAxios.get as jest.Mock).mockResolvedValueOnce({ status: 200 });

        (mockedAxios.get as jest.Mock).mockResolvedValueOnce({
            status: 200,
            data: { results: [{ id: 1, title: 'Test Movie', overview: 'Test Overview', poster_path: '/test.jpg', vote_average: 8 }] },
        });

        const res = await request(app).get('/now-playing?page=1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([{ id: 1, title: 'Test Movie', description: 'Test Overview', posterUrl: 'https://image.tmdb.org/t/p/original//test.jpg', rating: 8 }]);
    });

    it('GET /now-playing - bad request', async () => {
        const res = await request(app).get('/now-playing?page=abc');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ message: 'Page should be a number' });
    });

    it('GET /now-playing - internal server error', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Internal server error'));

        const res = await request(app).get('/now-playing?page=1');
        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({ message: 'Internal server error' });
    });

    it('GET /:movieId - success', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({
            status: 200,
            data: { id: 1, title: 'Test Movie', overview: 'Test Overview', poster_path: '/test.jpg', vote_average: 8 },
        });

        const res = await request(app).get('/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ id: 1, title: 'Test Movie', description: 'Test Overview', posterUrl: 'https://image.tmdb.org/t/p/original//test.jpg', rating: 8 });
    });

    it('GET /:movieId - bad request', async () => {
        const res = await request(app).get('/abc');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ message: 'Movie id should be a number' });
    });

    it('GET /:movieId - internal server error', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Internal server error'));

        const res = await request(app).get('/1');
        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({ message: 'Internal server error' });
    });

    // Tests for /search/:movieName endpoint
    it('GET /search/:movieName - success', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({
            status: 200,
            data: { results: [{ id: 1, title: 'Test Movie', overview: 'Test Overview', poster_path: '/test.jpg', vote_average: 8 }] },
        });

        const res = await request(app).get('/search/Test');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([{ id: 1, title: 'Test Movie', description: 'Test Overview', posterUrl: 'https://image.tmdb.org/t/p/original//test.jpg', rating: 8 }]);
    });

    it('GET /search/:movieName - bad request', async () => {
        const res = await request(app).get('/search/');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ message: 'Movie id should be a number' });
    });

    it('GET /search/:movieName - internal server error', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Internal server error'));

        const res = await request(app).get('/search/Test');
        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({ message: 'Internal server error' });
    });
});