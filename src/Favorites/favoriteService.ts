import {myDataSource} from "../config/app-data-source";
import {v4} from 'uuid';
import {Character} from "../Character/entities/Character.entity";
import {FilmService} from "../Film/filmService";
import {axiosSwapi} from "../config/apiClient";
import {Film} from "../Film/entities/Film.entity";
import { RawFilm} from "../Film/types";
import axios from "axios";
import {Favorite} from "./entities/Favorite.entity";

export class FavoriteService {
    // Dependency injection of FilmService to use its functionalities
    constructor(public filmService: FilmService) { }

    // Method to create a favorite list based on given film IDs and a name for the list
    public async createFavorite(filmIds: number[], listName: string) {
        // Transaction ensures atomicity, all or nothing
        await myDataSource.transaction(async (transactionalEntityManager) => {
            // Initialize Repositories
            const characterRepo = transactionalEntityManager.getRepository(Character);
            const filmRepo = transactionalEntityManager.getRepository(Film);
            const favoriteListRepo = transactionalEntityManager.getRepository(Favorite);
            const favoriteList = favoriteListRepo.create({
                id: v4(),
                name: listName,
                films: []  // Initialize empty array to hold films
            });
            // I download all films data at once instead of looping through each film to make it faster through filtering it on my own 
            const { data: allFilms }: { data: RawFilm[] } = await axiosSwapi.get('films');

            // Filter out only the films we are interested in
            const selectedFilms = allFilms.filter(film => filmIds.includes(film.episode_id));

            // Loop over each selected film
            for (const filmData of selectedFilms) {
                // Initialize an empty array to hold characters of the film
                let filmCharacters: Character[] = [];

                // Concurrently fetch character details for the current film
                const characterPromises = filmData.characters.map(url => axios.get(url));
                const characterResponses = await Promise.all(characterPromises);

                // Loop over each character to find or create it in the database
                for (const { data: characterData } of characterResponses) {
                    let [character] = await characterRepo.find({ where: { name: characterData.name } });

                    // If character doesn't exist, create and save it
                    if (!character) {
                        character = characterRepo.create({ id: v4(), name: characterData.name });
                        await characterRepo.save(character);
                    }

                    // Add the character to the film's character list
                    filmCharacters.push(character);
                }

                // Fetch existing film by title or create a new one
                let film = await filmRepo.findOne({
                    where: { title: filmData.title },
                    relations: ["characters"]
                });

                // If film doesn't exist, create and save it
                if (!film) {
                    film = filmRepo.create({
                        id: v4(),
                        title: filmData.title,
                        release_date: new Date(filmData.release_date),
                        characters: filmCharacters
                    });
                    await filmRepo.save(film);
                } else {
                    // Update the existing film's characters and save changes
                    film.characters = [...film.characters, ...filmCharacters];
                    await filmRepo.save(film);
                }
                // Add the film to the favorite list's films
                favoriteList.films.push(film);
            }
            // Save the favorite list with its films after the loop finishes
            await favoriteListRepo.save(favoriteList);
        });
    }
}