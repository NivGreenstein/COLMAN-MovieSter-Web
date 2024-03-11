import {Request, Response, NextFunction} from 'express';
import httpStatus from 'http-status-codes';
import * as authService from '../src/services/auth.service';
import * as userService from '../src/services/user.service';
import {login, logout, register} from '../src/controllers/authentication.controller';
import {UserRegister} from "../src/models/user.model";
import {ObjectId} from "mongodb";
import httpCode from "http-status-codes";

jest.mock('../src/services/auth.service', () => ({
    login: jest.fn(),
}));

describe('AuthController', () => {
    describe('login function', () => {
        it('should return 200 OK and set cookies when login is successful', async () => {
            const req = {
                body: {email: 'test@example.com', password: 'password123'},
            } as Request<{ email: string; password: string }, any, any, any, Record<string, any>>;

            const res = {
                cookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;

            const next: NextFunction = jest.fn();

            (authService.login as jest.Mock).mockResolvedValue({
                accessToken: 'fakeAccessToken',
                refreshToken: 'fakeRefreshToken',
            });

            await login(req, res, next);

            expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(res.cookie).toHaveBeenCalledTimes(2);
            expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 401 UNAUTHORIZED for invalid credentials', async () => {
            const req = {
                body: {email: 'wrong@example.com', password: 'incorrect'},
            } as Request<{ email: string; password: string }, any, any, any, Record<string, any>>;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next: NextFunction = jest.fn();

            (authService.login as jest.Mock).mockResolvedValue(null);

            await login(req, res, next);

            expect(authService.login).toHaveBeenCalledWith('wrong@example.com', 'incorrect');
            expect(res.status).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
            expect(res.json).toHaveBeenCalledWith({message: 'Invalid email or password'});
        });

        it('should return 400 BAD REQUEST for missing credentials', async () => {
            const req = {
                body: {},
            } as Request<{ email: string; password: string }, any, any, any, Record<string, any>>;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next: NextFunction = jest.fn();

            await login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
        });

        it('should return 400 BAD REQUEST for invalid email format', async () => {
            const req = {
                body: {email: 'invalidemail', password: 'password123'},
            } as Request<{ email: string; password: string }, any, any, any, Record<string, any>>;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next: NextFunction = jest.fn();

            await login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: expect.stringContaining('email')}));
        });

        it('should set secure, HttpOnly cookies with correct expiry for successful login', async () => {
            const req = {
                body: {email: 'test@example.com', password: 'password123'},
            } as Request<{ email: string; password: string }, any, any, any, Record<string, any>>;

            const res = {
                cookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;

            const next: NextFunction = jest.fn();

            (authService.login as jest.Mock).mockResolvedValue({
                accessToken: 'fakeAccessToken',
                refreshToken: 'fakeRefreshToken',
            });

            await login(req, res, next);

            expect(res.cookie).toHaveBeenCalledWith('access-token', expect.any(String), expect.objectContaining({
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: expect.any(Number),
            }));

            expect(res.cookie).toHaveBeenCalledWith('refresh-token', expect.any(String), expect.objectContaining({
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: expect.any(Number),
            }));
        });

        it('should return 401 Unauthorized for an incorrect email', async () => {
            const req = {
                body: {email: 'nonexistent@example.com', password: 'anyPassword'},
            } as Request<{ email: string; password: string }, any, any, any, Record<string, any>>;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next: NextFunction = jest.fn();

            (authService.login as jest.Mock).mockResolvedValue(null);

            await login(req, res, next);

            expect(authService.login).toHaveBeenCalledWith('nonexistent@example.com', 'anyPassword');
            expect(res.status).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: expect.any(String)}));
        });

        it('should return 401 Unauthorized for an incorrect password', async () => {
            const req = {
                body: {email: 'existing@example.com', password: 'wrongPassword'},
            } as Request<{ email: string; password: string }, any, any, any, Record<string, any>>;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next: NextFunction = jest.fn();

            (authService.login as jest.Mock).mockResolvedValue(null);

            await login(req, res, next);

            expect(authService.login).toHaveBeenCalledWith('existing@example.com', 'wrongPassword');
            expect(res.status).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: expect.any(String)}));
        });
    });

    describe('register function', () => {
        it('should return 201 Created on successful registration', async () => {
            const reqBody: UserRegister = {
                email: 'new@example.com',
                password: 'NewPass123',
                username: 'newUser',
                profilePictureUrl: 'http://example.com/pic.jpg',
            };

            const req = {
                body: reqBody,
            } as unknown as Request<UserRegister, any, any, any>;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next: NextFunction = jest.fn();

            jest.spyOn(userService, 'createUser').mockResolvedValue({
                _id: new ObjectId('123456789abc123456789abc'),
                ...reqBody,
            } as any);

            await register(req, res, next);

            expect(userService.createUser).toHaveBeenCalledWith(reqBody);
            expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
            expect(res.json).toHaveBeenCalledWith(expect.anything()); // Adjust according to the expected response
        });
        it('should return 400 Bad Request if required fields are missing', async () => {
            const req = {
                body: {email: 'new@example.com'}, // Missing password, username, and profilePictureUrl
            } as unknown as Request<UserRegister, any, any, any>;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next: NextFunction = jest.fn();

            await register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
        });
        it('should return 409 Conflict if email is already in use', async () => {
            const req = {
                body: {
                    email: 'existing@example.com',
                    password: 'ExistingPass123',
                    username: 'existingUser',
                    profilePictureUrl: 'http://example.com/pic.jpg'
                },
            } as unknown as Request<UserRegister, any, any, any>;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next: NextFunction = jest.fn();

            // Simulate userService.createUser throwing an error for duplicate email
            jest.spyOn(userService, 'createUser').mockImplementation(() => {
                throw new Error('Email already in use');
            });

            await register(req, res, next);

            expect(userService.createUser).toHaveBeenCalledWith(expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
        });
    });

    describe('logout function', () => {
        it('should clear cookies and return OK status on successful logout', async () => {
            // Mock request and response
            const req: Partial<Request> = {
                cookies: {
                    'refresh-token': 'some-refresh-token',
                },
            };
            const res: Partial<Response> = {
                clearCookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            const next: NextFunction = jest.fn();

            jest.spyOn(authService, 'logout').mockImplementation(() => true);

            await logout(req as Request<undefined, undefined, undefined, undefined>, res as Response, next);

            // Assertions
            expect(authService.logout).toHaveBeenCalledWith('some-refresh-token');
            expect(res.clearCookie).toHaveBeenCalledWith('access-token');
            expect(res.clearCookie).toHaveBeenCalledWith('refresh-token');
            expect(res.status).toHaveBeenCalledWith(httpCode.OK);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return INTERNAL_SERVER_ERROR status on failed logout', async () => {
            // Mock request and response for failed logout scenario
            const req: Partial<Request> = {
                cookies: {
                    'refresh-token': 'invalid-refresh-token',
                },
            };
            const res: Partial<Response> = {
                clearCookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next: NextFunction = jest.fn();

            jest.spyOn(authService, 'logout').mockImplementation(() => false);

            await logout(req as Request<undefined, undefined, undefined, undefined>, res as Response, next);

            expect(authService.logout).toHaveBeenCalledWith('invalid-refresh-token');
            expect(res.status).toHaveBeenCalledWith(httpCode.INTERNAL_SERVER_ERROR);
            expect(res.json).toHaveBeenCalledWith({message: 'Internal server error'});
        });
    });
});
