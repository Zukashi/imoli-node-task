// FilmController.ts
import { Request, Response } from 'express';
import {InternalServiceError} from "../utils/errors";
import {FilmService} from "./filmService";

export class FilmController {
    private filmService: FilmService;

    constructor(filmService: FilmService) {
        this.filmService = filmService;
    }

    public async handleGetFilms(req: Request, res: Response) {
        try {
            const films = await this.getFilms();  // private method getFilms is called here
            res.json(films);
        } catch (error) {
            const internalError = new InternalServiceError('Failed to fetch films', 500);
            // Here you could log the error or take other actions
            res.status(internalError.statusCode!).json({ error: internalError.message });
        }
    }

    private async getFilms() {
        return this.filmService.fetchFilms();
    }
}
