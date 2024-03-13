// @ts-nocheck
import request from 'supertest';
import express from 'express';
import {ObjectId} from 'mongodb';
import userRouter from '../src/routes/user.router';
import * as userService from '../src/services/user.service';
import * as service from "../src/services/comment.service";

jest.mock('../src/services/user.service');

const app = express();
app.use(express.json());
app.use('/users', userRouter);

describe('UserController', () => {
    describe('POST /users', () => {
        it('should create a user successfully', async () => {
            const mockUser = {username: 'testuser', email: 'test@example.com', password: 'password123'};
            const mockResponse = new ObjectId();
            (userService.createUser as jest.MockedFunction<typeof userService.createUser>).mockResolvedValue(mockResponse);

            const response = await request(app)
                .post('/users')
                .send(mockUser);


            expect(response.statusCode).toBe(201);
            expect(response.body._id).toEqual(mockResponse.toString());
            expect(userService.createUser).toHaveBeenCalledWith(expect.objectContaining(mockUser));
        });

        it('should return 400 BAD REQUEST when required fields are missing', async () => {
            const response = await request(app)
                .post('/users')
                .send({email: 'test@example.com'});

            expect(response.statusCode).toBe(400);
        });
    });

    describe('GET /users/:id', () => {
        it('should return a user by ID', async () => {
            const userId = new ObjectId();
            const mockUser = {_id: userId, username: 'testuser', email: 'test@example.com'};
            userService.getUserById.mockResolvedValue(mockUser);

            const response = await request(app).get(`/users/${userId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockUser);
            expect(userService.getUserById).toHaveBeenCalledWith(userId.toString());
        });

        it('should return 404 NOT FOUND when user does not exist', async () => {
            const userId = new ObjectId();
            userService.getUserById.mockResolvedValue(null);

            const response = await request(app).get(`/users/${userId}`);

            expect(response.statusCode).toBe(404);
        });
    });
});

