import { Request, Response } from 'express';
import {FavoriteService} from "./favoriteService";
import {ValidationError} from "../utils/errors";
import ExcelJS from 'exceljs';
export class FavoriteController {

    constructor(public favoriteService: FavoriteService) {}

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

    public async getFavorites(req: Request, res: Response) {
        try {
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const name = req.query.name ? String(req.query.name) : "";

            const favoritesData = await this.favoriteService.getFavorites(page, limit, name);

            res.status(200).json(favoritesData);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public async getFavoriteById(req: Request, res: Response) {
        try {
            const {id} = req.params;

            const favoriteList = await this.favoriteService.getFavoriteById(id);
            if (!favoriteList) {
                return res.status(404).json({ error: 'Favorite list not found' });
            }
            res.status(200).json(favoriteList);
        } catch (error) {
            res.status(error.statusCode).json({ error: 'Internal Server Error' });
        }
    }
    public async handleGetFavoriteExcel(req: Request, res: Response) {
        try {
            const favoriteId = req.params.id;
            const excelBuffer = await this.favoriteService.generateFavoriteExcel(favoriteId);

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=Favorites.xlsx'
            );
            res.end(excelBuffer);

        } catch (error) {
            res.status(500).json({ error: 'Failed to generate Excel file' });
        }
    }
}