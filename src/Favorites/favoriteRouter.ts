import { Router } from 'express';
import {FavoriteService} from "./favoriteService";
import {FavoriteController} from "./favoriteController";
import {FilmService} from "../Film/filmService";

export const favoritesRouter = Router();
const filmService = new FilmService();
const favoriteService = new FavoriteService(filmService);
const favoriteController = new FavoriteController(favoriteService);
// Define routes for handling favorites here
favoritesRouter.post('/', (req, res) => favoriteController.handleCreateFavoriteList(req, res));


