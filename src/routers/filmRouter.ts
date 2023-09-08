import { Router } from 'express';
import {FilmService} from "../services/filmService";
import {FilmController} from "../controllers/filmController";

const router = Router();
const filmService = new FilmService();
const filmController = new FilmController(filmService);

router.get('/films', (req, res) => filmController.handleGetFilms(req, res));

export default router;
