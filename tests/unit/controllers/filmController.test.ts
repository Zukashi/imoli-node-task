import { Request, Response } from 'express';
import { FilmService } from '../../../src/services/filmService';
import { FilmController } from '../../../src/controllers/filmController';

jest.mock('../../../src/services/filmService');

describe('FilmController - handleGetFilms method', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let filmService: FilmService;
    let filmController: FilmController;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        filmService = new FilmService();
        filmController = new FilmController(filmService);
    });

    it('should return a 200 status and the fetched films when the service successfully fetches films', async () => {
        const mockFilms = [
            { title: 'Film 1', release_date: 'date1', id: 1 },
            { title: 'Film 2', release_date: 'date2', id: 2 },
        ];

        (FilmService.prototype.fetchFilms as jest.Mock).mockResolvedValue(mockFilms);

        await filmController.handleGetFilms(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.json).toHaveBeenCalledWith(mockFilms);
        expect(mockResponse.status).not.toHaveBeenCalled(); // Assuming status defaults to 200 if not set
    });

    it('should return a 500 status and an error message when the service throws an error', async () => {
        (FilmService.prototype.fetchFilms as jest.Mock).mockRejectedValue(new Error('Service Error'));

        await filmController.handleGetFilms(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch films' });
    });

    // Example for additional edge case
    it('should return a 200 status and an empty array when the service returns no films', async () => {
        (FilmService.prototype.fetchFilms as jest.Mock).mockResolvedValue([]);

        await filmController.handleGetFilms(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.json).toHaveBeenCalledWith([]);
        expect(mockResponse.status).not.toHaveBeenCalled(); // Assuming status defaults to 200 if not set
    });
});