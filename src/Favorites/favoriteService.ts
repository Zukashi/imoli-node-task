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

export class FavoriteService {
    constructor(
        private characterService: CharacterService,
        private filmService: FilmService
    ) {}

    public async createFavorite(filmIds: number[], listName: string): Promise<void> {
        try {
            await myDataSource.transaction(async (transactionalEntityManager: EntityManager) => {
                // Initialize Repositories
                const characterRepo = transactionalEntityManager.getRepository(Character);
                const filmRepo = transactionalEntityManager.getRepository(Film);
                const favoriteListRepo = transactionalEntityManager.getRepository(Favorite);

                // Check if list with this name already exists
                if (await this.listNameExists(listName, favoriteListRepo)) {
                    throw new ValidationError("List name already exists.", 409);
                }

                // Fetch films and add to favorites
                const favoriteList = await this.buildFavoriteList(filmIds, listName, filmRepo, characterRepo);

                // Save the favorite list to the database
                await favoriteListRepo.save(favoriteList);
            });
        } catch (error) {
            console.error('Error while creating favorite:', error.message);
            throw new ValidationError(error.message, error.statusCode);
        }
    }

    private async listNameExists(listName: string, favoriteListRepo: Repository<Favorite>): Promise<boolean> {
        const existingList = await favoriteListRepo.findOne({ where: { name: listName } });
        return !!existingList;
    }

    private async buildFavoriteList(
        filmIds: number[],
        listName: string,
        filmRepo: Repository<Film>,
        characterRepo: Repository<Character>
    ): Promise<Favorite> {
        // Fetch all films from SWAPI
        const { data: allFilms }: { data: RawFilm[] } = await axiosSwapi.get('films');
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
