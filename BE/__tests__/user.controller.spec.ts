// @ts-nocheck
import request from 'supertest';
import express from 'express';
import {ObjectId} from 'mongodb';
import userRouter from '../src/routes/user.router';
import * as userService from '../src/services/user.service';
import * as service from "../src/services/comment.service";
import httpCode from "http-status-codes";

jest.mock('../src/services/user.service');

function testUserIdMiddleware(req, res, next) {
    req.userId = '60d0fe4f5311236168a109ca';
    next();
}

const app = express();
app.use(express.json());
app.use(testUserIdMiddleware);
app.use('/users', userRouter);

describe('UserController', () => {
    describe('PATCH /users', () => {
        const mockId: string = '60d0fe4f5311236168a109ca';
        it('should update a user successfully', async () => {
            const mockUser = {username: 'testuser', email: 'test@example.com', _id: mockId};
            const mockResponse = new ObjectId();
            (userService.updateUser as jest.MockedFunction<typeof userService.createUser>).mockResolvedValue(mockResponse);


            const response = await request(app)
                .patch(`/users`)
                .send(mockUser)

            expect(response.statusCode).toBe(httpCode.NO_CONTENT);
        });

        it('should return 400 BAD REQUEST when required fields are missing', async () => {
            const response = await request(app)
                .patch('/users')
                .set('email', 'test@example.com').send();

            expect(response.statusCode).toBe(400);
        });
    });

    describe('GET /users/:id', () => {
        it('should return a user by ID', async () => {
            const userId = '60d0fe4f5311236168a109ca';
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

            expect(response.status).toBe(404);
        });
    });
});

