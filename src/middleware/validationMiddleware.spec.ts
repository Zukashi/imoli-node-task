

import request from 'supertest';
import express, {NextFunction, Response, Request} from 'express';
import { validationMiddleware } from './validationMiddleware';
import {CreateFavoriteListDTO} from "../Favorites/dto/CreateFavoriteList.dto";



const app = express();
app.use(express.json());

// Define an example POST endpoint using the validation middleware
app.post(
    '/favorites',
    validationMiddleware(CreateFavoriteListDTO),
    (req, res) => res.status(201).send('Created')
);

// Mock objects for request and response
const mockRequest = {} as Request;
const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
} as unknown as Response;

// Mock object for the next function in the middleware
const mockNext: NextFunction = jest.fn();
describe('Validation Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Group for valid scenarios
    describe('Valid Request Body', () => {
        it('should pass validation and return 201', async () => {
            await request(app)
                .post('/favorites')
                .send({ name: 'Fav List', filmIds: [1, 2, 3] })
                .expect(201);
        });
        // Test case to check if the next function is called for valid requests
        it('should call next() once if validation passes', async () => {
            const middleware = validationMiddleware(CreateFavoriteListDTO);

            // Set up a valid request body
            mockRequest.body = { name: 'Fav List', filmIds: [1, 2, 3] };

            // Invoke the middleware
            await middleware(mockRequest, mockResponse, mockNext);

            // Verify that next() was called exactly once
            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });

    // Group for invalid scenarios
    describe('Invalid Request Body', () => {
        it('should fail validation and return 400', async () => {
            await request(app)
                .post('/favorites')
                .send({ name: '', filmIds: 'not an array' })
                .expect(400);
        });

        it('should fail when no body is sent', async () => {
            await request(app)
                .post('/favorites')
                .send({})
                .expect(400);
        });

        it('should disallow additional fields', async () => {
            await request(app)
                .post('/favorites')
                .send({ name: 'Fav List', filmIds: [1, 2, 3], extraField: 'additional field text'  })
                .expect(400);
        });
    });
});
