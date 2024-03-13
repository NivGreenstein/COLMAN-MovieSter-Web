// @ts-nocheck
import {
    createComment,
    updateComment,
    getCommentById,
    deleteComment,
    getCommentsByMovieId,
    getCommentsByUserId,
    getCommentsThread
} from '../src/controllers/comment.controller';
import * as service from '../src/services/comment.service';
import {NextFunction} from "express";
import httpCode from "http-status-codes";

// Mock the Express request and response objects
const mockRequest = (body: any, params: any, file: any) => {
    return {
        body,
        params,
        file,
    };
};

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    // Adding send method
    res.send = jest.fn().mockReturnValue(res);
    return res;
};


jest.mock('../src/services/comment.service');

describe('Comment Controller', () => {
    describe('createComment', () => {
        it('should create a comment', async () => {
            const mockUserId = '65e8e3d3b9e041800afe68bf'; // Example user ID
            const mockCommentData = {movieId: 123, description: 'Great movie!', rating: 8, userId: mockUserId};
            const mockCommentResponse = "newCommentId"; // Assuming your service returns a comment ID string
            const mockImagePath = 'image.jpg'; // Assuming this is the path you expect

            const req = mockRequest(mockCommentData, {}, {path: mockImagePath}, mockUserId); // Adjust mockRequest to accept userId
            req.userId = mockUserId; // Set the userId directly on the req object

            const res = mockResponse();
            const next = jest.fn();

            (service.createComment as jest.MockedFunction<typeof service.createComment>).mockResolvedValueOnce(mockCommentResponse);

            await createComment(req as any, res, next);

            const expectedResponse = {_id: mockCommentResponse, imagePath: mockImagePath};
            expect(res.json).toHaveBeenCalledWith(expectedResponse);
        });


        it('should return 400 if required fields are missing', async () => {
            const req = mockRequest({}, {}, {});
            const res = mockResponse();
            const next: NextFunction = jest.fn();

            await createComment(req as any, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    it('should update a comment', async () => {
        const mockCommentId = '60d0fe4f5311236168a109ca'; // Assuming this is the comment's ID
        const mockUserId = '60d0fe4f5311236168a109cb'; // Assuming this is the user's ID
        const req = mockRequest({
            _id: mockCommentId,
            userId: mockUserId,
            description: 'Updated comment',
            rating: 9
        }, {}, {path: 'image.jpg'});
        const res = mockResponse();
        const next: NextFunction = jest.fn();

        (service.updateComment as jest.MockedFunction<typeof service.updateComment>).mockResolvedValueOnce({
            modifiedCount: 1
        });

        req.userId = mockUserId;

        await updateComment(req as any, res, next);

        const expectedResponse = {_id: mockCommentId, imagePath: 'image.jpg'};
        expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });


    it('should return 400 if id is missing', async () => {
        const req = mockRequest({}, {}, {});
        const res = mockResponse();
        const next: NextFunction = jest.fn();

        await updateComment(req as any, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    describe('getCommentById', () => {
        it('should return a comment by id', async () => {
            const req = mockRequest({}, {id: '60d0fe4f5311236168a109ca'}, {});
            const res = mockResponse();
            const next: NextFunction = jest.fn();

            (service.readComment as jest.MockedFunction<typeof service.readComment>).mockResolvedValueOnce(req.body);

            await getCommentById(req as any, res, next);

            expect(res.json).toHaveBeenCalledWith(req.body);
        });
    });

    describe('deleteComment', () => {
        it('should delete a comment', async () => {
            const req = mockRequest({}, {id: '60d0fe4f5311236168a109ca'}, {});
            const res = mockResponse();
            const next: NextFunction = jest.fn();

            (service.deleteComment as jest.MockedFunction<typeof service.deleteComment>).mockResolvedValueOnce({
                acknowledged: true,
                deletedCount: 1
            });

            await deleteComment(req as any, res, next);

            expect(res.send).toHaveBeenCalled(); // Changed to check that send is called
            expect(res.status).toHaveBeenCalledWith(204); // NO_CONTENT status code check
        });


        it('should return 400 if comment with given id does not exist', async () => {
            const req = mockRequest({}, {id: '60d0fe4f5311236168a109ca'}, {});
            const res = mockResponse();
            const next: NextFunction = jest.fn();

            (service.deleteComment as jest.MockedFunction<typeof service.deleteComment>).mockRejectedValueOnce(new Error('Comment not found'));

            await deleteComment(req as any, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('getCommentsByMovieId', () => {
        it('should return comments by movie id', async () => {
            const req = mockRequest({}, {movieId: '123'}, {});
            const res = mockResponse();
            const next: NextFunction = jest.fn();

            (service.getCommentsByMovieId as jest.MockedFunction<typeof service.getCommentsByMovieId>).mockResolvedValueOnce([req.body]);

            await getCommentsByMovieId(req as any, res, next);

            expect(res.json).toHaveBeenCalledWith([req.body]);
        });

        it('should return 404 if comment with given id does not exist', async () => {
            const req = mockRequest({}, {id: '60d0fe4f5311236168a109ca'}, {});
            const res = mockResponse();
            const next: NextFunction = jest.fn();

            (service.deleteComment as jest.MockedFunction<typeof service.deleteComment>).mockResolvedValueOnce({
                acknowledged: true,
                deletedCount: 0
            });

            await deleteComment(req as any, res, next);

            expect(res.status).toHaveBeenCalledWith(httpCode.NOT_FOUND);
            expect(res.json).toHaveBeenCalledWith({message: 'Comment not found'});
        });
    });

    describe('getCommentsByUserId', () => {
        it('should return comments by user id', async () => {
            const req = mockRequest({}, {userId: '60d0fe4f5311236168a109ca'}, {});
            const res = mockResponse();
            const next: NextFunction = jest.fn();

            (service.getCommentsByUserId as jest.MockedFunction<typeof service.getCommentsByUserId>).mockResolvedValueOnce([req.body]);

            await getCommentsByUserId(req as any, res, next);

            expect(res.json).toHaveBeenCalledWith([req.body]);
        });
    });

    describe('getCommentsThread', () => {
        it('should return comments thread', async () => {
            const req = mockRequest({}, {mainCommentId: '60d0fe4f5311236168a109ca'}, {});
            const res = mockResponse();
            const next: NextFunction = jest.fn();

            (service.getCommentsThread as jest.MockedFunction<typeof service.getCommentsThread>).mockResolvedValueOnce([req.body]);

            await getCommentsThread(req as any, res, next);

            expect(res.json).toHaveBeenCalledWith([req.body]);
        });
    });
});