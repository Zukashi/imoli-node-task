import axios, { AxiosResponse } from 'axios';
import {RawFilm, SimplifiedFilm} from "../types";

export class FilmService {
    public async fetchFilms(): Promise<SimplifiedFilm[]> {
        try {
            const response: AxiosResponse<{ results: RawFilm[] }> = await axios.get('films');
            return response.data.results.map((film: RawFilm) => ({
                title: film.title,
                release_date: film.release_date,
                id: film.episode_id,
            }));
        } catch (error) {
            throw new Error('Error fetching films');
        }
    }
}