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
            // Here you could log the error or take other actions
            console.log(error)
            res.status(error.statusCode).json({error: error.message});
        }
    }
}