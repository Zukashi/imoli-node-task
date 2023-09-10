import {Repository} from "typeorm";
import {Character} from "./entities/Character.entity";
import axios, {AxiosResponse} from "axios";
import {v4} from "uuid";
import {ValidationError} from "../utils/errors";

export class CharacterService {

    constructor() {}
    public async fetchCharacters(characterUrls: string[], characterRepo: Repository<Character>): Promise<Character[]> {
        try {
            const characterPromises = characterUrls.map(url => axios.get(url));
            const characterResponses:AxiosResponse<Character>[] = await Promise.all(characterPromises);

            const characters: Character[] = [];
            for (const { data: characterData } of characterResponses) {
                let [character] = await characterRepo.find({ where: { name: characterData.name } });
                if (!character) {
                    character = characterRepo.create({ id: v4(), ...characterData });
                    await characterRepo.save(character);
                }

                characters.push(character);
            }
            return characters;
        } catch (error) {
            console.error('Error while fetching characters:', error);
            throw new ValidationError('Failed to fetch characters', 500);
        }
    }
}




