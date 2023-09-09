import {myDataSource} from "../config/app-data-source";
import {v4} from 'uuid';
import {Character} from "../Character/entities/Character.entity";
import {FilmService} from "../Film/filmService";
import {axiosSwapi} from "../config/apiClient";
import {RawCharacter, RawCharacterApi} from "../Character/types/character-entity";
import {Film} from "../Film/entities/Film.entity";
import {FilmApiResponse, RawFilm} from "../Film/types";
import {log} from "util";
import axios from "axios";

export class FavoriteService {
    // constructor, other methods...
    constructor(public filmService: FilmService) {}
    public async createFavorite(filmIds: number[], name: string) {
        await myDataSource.transaction(async (transactionalEntityManager) => {
            const characterRepository = transactionalEntityManager.getRepository(Character);
            const filmRepository = transactionalEntityManager.getRepository(Film);

            {/*I download all films data at once instead of looping through each film to make it faster through filtering it on my own   */}
            const {data}:{data:RawFilm[]} = await axiosSwapi.get(`films`);
            const films = data.filter(film => filmIds.includes(film.episode_id));

            for (const detail of films) {
                const data:RawFilm = detail

                let film = await filmRepository.findOne({ where:{title:data.title}, relations:{
                    characters:true
                    } });
                const characterUrls = data.characters || [];
                const characters = [];

                // If film already exists then dont check characters because they are already inside db
                 if(!film){
                     for (const charUrl of characterUrls) {
                         /* I had two options for handling character details in films:
                         1. Store character URLs, making the process faster and ensuring up-to-date data from the API. However, this would require fetching characters every time they're needed.
                         2. Fetch character details and store them in the database, as I've done. This approach reduces the load on subsequent requests and provides easy access to character information.

                          I went with the second one
                          */
                         const characterResponse = await axios.get(charUrl);
                         const characterIfExistsAlreadyInDb = await characterRepository.findBy({name:characterResponse.data.name});
                         if(!(characterIfExistsAlreadyInDb.length)){
                             const character = characterRepository.create({
                                 id: v4(),
                                 name: characterResponse.data.name,
                             });
                             await characterRepository.save(character);
                             characters.push(characterIfExistsAlreadyInDb[0]);

                         }


                     };
                 }

                if (film) {
                    film.characters = [...film.characters, ...characters];
                    await filmRepository.save(film);

                    let film2 = await filmRepository.findOne({ where:{title:data.title}, relations:{
                            characters:true
                        } });

                } else {
                    film = filmRepository.create({
                        id: v4(), // Using UUID v4 for uniqueness
                        title: data.title,
                        release_date: data.release_date,
                        characters: characters  // Assign the fetched or created Character entities here
                    });
                    await filmRepository.save(film);
                }
            }
        });
    }
}
