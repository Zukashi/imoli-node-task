import {myDataSource} from "../config/app-data-source";
import {v4} from 'uuid';
import {Character} from "../Character/entities/Character.entity";
import {FilmService} from "../Film/filmService";
import {axiosSwapi} from "../config/apiClient";
import {RawCharacter} from "../Character/types/character-entity";
import {Film} from "../Film/entities/Film.entity";

export class FavoriteService {
    // constructor, other methods...
    constructor(public filmService: FilmService) {}
    public async createFavorite(filmIds: number[], name: string) {
        await myDataSource.transaction(async (transactionalEntityManager) => {
            const characterRepository = transactionalEntityManager.getRepository(Character);
            const filmRepository = transactionalEntityManager.getRepository(Film);

            for (const id of filmIds) {
                let film = await this.filmService.fetchFilmById(id);
                let filmExist = await filmRepository.findOne({ where: { title: film.title } });

                if (!filmExist) {
                    const newFilm = filmRepository.create({
                        id: v4(),
                        title: film.title,
                        release_date: film.release_date
                    });
                    await filmRepository.save(newFilm);
                }
                return
            //     let filmExist2 = await filmRepository.findOne({ where: { title: film.title } });
            //     console.log(filmExist2)
            //
            //     for (const character of film.characters) {
            //         let characterDetails: RawCharacter;
            //         try {
            //             const {data} = await axiosSwapi.get(character);
            //             characterDetails = data;
            //         } catch (error) {
            //             console.error(`Could not fetch details for character: ${character}`);
            //             continue;
            //         }
            //         const existingCharacter = await characterRepository.findOne({ where: { name: characterDetails.name } });
            //         if (!existingCharacter) {
            //             const films = await Promise.all(
            //                 characterDetails.films.map(async (film) => {
            //                     const {data: filmRaw} = await axiosSwapi.get(film);
            //                     return {
            //                         title: filmRaw.title,
            //                         release_date: filmRaw.release_date,
            //                         id: v4(),
            //                     };
            //                 })
            //             );
            //             const newCharacter = characterRepository.create({
            //                 id: v4(),
            //                 name: characterDetails.name,
            //                 films
            //             });
            //             console.log(newCharacter)
            //             return
            //             await characterRepository.save(newCharacter);
            //         } else {
            //             console.error(`Character with the name ${characterDetails.name} already exists.`);
            //         }
            //     }
            }
        });
    }
}
