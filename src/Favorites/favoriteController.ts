import { Request, Response } from 'express';
import { InternalServiceError } from "../utils/errors";
import {FavoriteService} from "./favoriteService";

export class FavoriteController {
    private favoriteService: FavoriteService;

    constructor(favoriteService: FavoriteService) {
        this.favoriteService = favoriteService;
    }

    public async handleCreateFavoriteList(req: Request, res: Response) {
        try {
            const { filmIds, name } = req.body;
            const newFavoriteList = await this.favoriteService.createFavorite(filmIds, name);
            res.status(201).json(newFavoriteList);
        } catch (error) {
            const internalError = new InternalServiceError(error, 500);
            // Here you could log the error or take other actions
            res.status(internalError.statusCode!).json({error: internalError.message});
        }
    }
}