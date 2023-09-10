import { Router } from 'express';
import {FavoriteService} from "./favoriteService";
import {FavoriteController} from "./favoriteController";
import {FilmService} from "../Film/filmService";
import {CharacterService} from "../Character/characterService";
import {validationMiddleware} from "../middleware/validationMiddleware";
import {CreateFavoriteListDTO} from "./dto/CreateFavoriteList.dto";
import {validateQueryParams} from "../middleware/validateQueryParams";
import {GetFavoritesQueryDTO} from "./dto/GetFavoritesQueryParams.dto";

export const favoritesRouter = Router();
const filmService = new FilmService();
const characterService = new CharacterService();
const favoriteService = new FavoriteService(characterService, filmService);
const favoriteController = new FavoriteController(favoriteService);

favoritesRouter.post('/',validationMiddleware(CreateFavoriteListDTO), (req,     res) => favoriteController.handleCreateFavoriteList(req, res))
    .get('/', validateQueryParams(GetFavoritesQueryDTO),(req,res) => favoriteController.getFavorites(req,res))
    .get('/:id',(req,res) => favoriteController.getFavoriteById(req,res))
    .get('/:id/file', (req,res) => favoriteController.handleGetFavoriteExcel(req,res))
;


