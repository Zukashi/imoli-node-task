// favoriteController.test.ts

import { Request, Response } from 'express';
import { FavoriteController } from './favoriteController';
import { FavoriteService } from './favoriteService';
import { CharacterService } from '../Character/characterService';
import { FilmService } from '../Film/filmService';
import { ValidationError } from '../utils/errors';
import request from "supertest";
import {app} from "../app";

jest.mock('./favoriteService');
jest.mock('../Character/characterService');
jest.mock('../Film/filmService');

describe('FavoriteController', () => {
    let favoriteController: FavoriteController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockFavoriteService: jest.Mocked<FavoriteService>;
    let mockCharacterService: jest.Mocked<CharacterService>;
    let mockFilmService: jest.Mocked<FilmService>;

    beforeEach(() => {

        mockFavoriteService = new FavoriteService(mockCharacterService, mockFilmService) as jest.Mocked<FavoriteService>;
        mockCharacterService = new CharacterService() as jest.Mocked<CharacterService>;
        mockFilmService = new FilmService() as jest.Mocked<FilmService>;

        favoriteController = new FavoriteController(mockFavoriteService);
    });

    describe('POST /favorites', () => {
        beforeEach(() => {
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            mockRequest = {
                body: {
                    filmIds: [1, 2],
                    name: 'My Favorite List'
                }
            };
        });
        beforeAll(() => {
            app.listen(3000);
        });

        afterAll((done) => {
            app.listen(3000).close(done);
        });
        it('should create a new favorite list successfully', async () => {
            await favoriteController.handleCreateFavoriteList(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalled();
        });

        it('should handle the case where the list name already exists', async () => {
            mockFavoriteService.createFavorite.mockImplementation(() => {
                throw new ValidationError('List name already exists.', 409);
            });

            await favoriteController.handleCreateFavoriteList(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'List name already exists.' });
        });

        it('should handle other errors gracefully', async () => {
            mockFavoriteService.createFavorite.mockImplementation(() => {
                throw new Error('Some other error');
            });

            await favoriteController.handleCreateFavoriteList(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(undefined);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Some other error' });
        });
    });
    describe('GET /favorites', () => {
        let getMockRequest: Partial<Request>;
        let getMockResponse: Partial<Response>;
        beforeEach(() => {
            getMockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            getMockRequest = {
                query: {
                    page: '1',
                    limit: '2'
                }
            };
        });
        it('should return 200 and a list of favorites', async () => {
            mockFavoriteService.getFavorites.mockResolvedValue({
                data: [],
                total: 2,
                currentPage: 1,
                totalPages: 1
            });
            await favoriteController.getFavorites(getMockRequest as Request, getMockResponse as Response);
            expect(getMockResponse.status).toHaveBeenCalledWith(200);
            expect(getMockResponse.json).toHaveBeenCalledWith({
                data: [],
                total: 2,
                currentPage: 1,
                totalPages: 1
            });
        });

        it('should return 200 and an empty list when no data exists', async () => {
            mockFavoriteService.getFavorites.mockResolvedValue({
                data: [],
                total: 0,
                currentPage: 1,
                totalPages: 0
            });
            await favoriteController.getFavorites(getMockRequest as Request, getMockResponse as Response);
            expect(getMockResponse.status).toHaveBeenCalledWith(200);
            expect(getMockResponse.json).toHaveBeenCalledWith({
                data: [],
                total: 0,
                currentPage: 1,
                totalPages: 0
            });
        });

        it('should return 400 for invalid query parameters', async () => {
            await request(app)
                .get('/favorites?page=abc&limit=2')
                .expect(400)
                .then(response => {
                    expect(response.body)
                });
        });

        it('should return 500 when an exception occurs', async () => {
            mockFavoriteService.getFavorites.mockImplementation(() => {
                throw new Error('Internal Server Error');
            });
            await favoriteController.getFavorites(getMockRequest as Request, getMockResponse as Response);
            expect(getMockResponse.status).toHaveBeenCalledWith(500);
            expect(getMockResponse.json).toHaveBeenCalledWith({
                error: 'Internal Server Error'
            });
         })});

});
