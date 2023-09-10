// favoriteController.test.ts

import { Request, Response } from 'express';
import { FavoriteController } from './favoriteController';
import { FavoriteService } from './favoriteService';
import { CharacterService } from '../Character/characterService';
import { FilmService } from '../Film/filmService';
import { ValidationError } from '../utils/errors';

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

        mockFavoriteService = new FavoriteService(mockCharacterService, mockFilmService) as jest.Mocked<FavoriteService>;
        mockCharacterService = new CharacterService() as jest.Mocked<CharacterService>;
        mockFilmService = new FilmService() as jest.Mocked<FilmService>;

        favoriteController = new FavoriteController(mockFavoriteService);
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
