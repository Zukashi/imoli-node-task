import NodeCache from 'node-cache';
import { myDataSource } from "../config/app-data-source";
import { v4 } from 'uuid';
import { Character } from "../Character/entities/Character.entity";
import { Film } from "../Film/entities/Film.entity";
import { RawFilm } from "../Film/types";
import { Favorite } from "./entities/Favorite.entity";
import { Repository, EntityManager } from 'typeorm';
import { axiosSwapi } from "../config/apiClient";
import { ValidationError } from "../utils/errors";
import { CharacterService } from "../Character/characterService";
import { FilmService } from "../Film/filmService";

// Initialize cache
const myCache = new NodeCache({ stdTTL: 600 });  // 10 minute time to live

export class FavoriteService {
    constructor(
        private characterService: CharacterService,
        private filmService: FilmService
    ) {}

    public async createFavorite(filmIds: number[], listName: string): Promise<void> {
        try {
            // Transactional operation to ensure atomicity
            await myDataSource.transaction(async (transactionalEntityManager: EntityManager) => {
                const characterRepo = transactionalEntityManager.getRepository(Character);
                const filmRepo = transactionalEntityManager.getRepository(Film);
                const favoriteListRepo = transactionalEntityManager.getRepository(Favorite);

                // Check if list name already exists with cache
                if (await this.listNameExists(listName, favoriteListRepo)) {
                    throw new ValidationError("List name already exists.", 409);
                }

                // Build favorite list after fetching or caching films and characters
                const favoriteList = await this.buildFavoriteList(filmIds, listName, filmRepo, characterRepo);

                // Save the favorite list to the database
                await favoriteListRepo.save(favoriteList);
            });
        } catch (error) {
            console.error('Error while creating favorite:', error.message);
            throw new ValidationError(error.message, error.statusCode);
        }
    }

    // Function to check if list name already exists with caching
    private async listNameExists(listName: string, favoriteListRepo: Repository<Favorite>): Promise<boolean> {
        const cacheKey = `listName-${listName}`;
        const cachedValue = myCache.get(cacheKey);
        if (cachedValue) {
            return true;
        }
        const existingList = await favoriteListRepo.findOne({ where: { name: listName } });
        const exists = !!existingList;
        if (exists) {
            myCache.set(cacheKey, true);
        }
        return exists;
    }

    // Function to build favorite list with caching for films
    private async buildFavoriteList(
        filmIds: number[],
        listName: string,
        filmRepo: Repository<Film>,
        characterRepo: Repository<Character>
    ): Promise<Favorite> {
        const cacheKey = 'allFilms';
        let allFilms: RawFilm[] = myCache.get(cacheKey) || [];

        // Fetch all films from SWAPI and cache it
        if (!allFilms.length) {
            const { data } = await axiosSwapi.get('films');
            allFilms = data;
            myCache.set(cacheKey, allFilms);
        }

        const selectedFilms = allFilms.filter(film => filmIds.includes(film.episode_id));

        // Create a new favorite list entity
        const favoriteList = new Favorite();
        favoriteList.id = v4();
        favoriteList.name = listName;
        favoriteList.films = [];

        for (const filmData of selectedFilms) {
            // Fetch or create characters related to the film
            const filmCharacters = await this.characterService.fetchCharacters(filmData.characters, characterRepo);

            // Fetch or create the film and update its characters
            const film = await this.filmService.findOrCreateFilm(filmData, filmRepo, filmCharacters);

            // Add the film to the favorite list
            favoriteList.films.push(film);
        }

        return favoriteList;
    }
}
