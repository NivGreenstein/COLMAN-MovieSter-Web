import {Request, Response, NextFunction} from 'express';
import httpStatus from 'http-status-codes';
import * as authService from '../src/services/auth.service';
import {login} from '../src/controllers/authentication.controller';

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
    });
});
