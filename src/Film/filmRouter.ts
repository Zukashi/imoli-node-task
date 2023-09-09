import { Router } from 'express';
import {FilmService} from "./filmService";
import {FilmController} from "./filmController";

export const filmRouter = Router();
const filmService = new FilmService();
const filmController = new FilmController(filmService);

filmRouter.get('/', (req, res) => filmController.handleGetFilms(req, res));


