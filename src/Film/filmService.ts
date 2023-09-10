import axios, { AxiosResponse } from 'axios';
import {FilmApiResponse, RawFilm, SimplifiedFilm} from "./types";
import {axiosSwapi} from "../config/apiClient";
import {Repository} from "typeorm";
import {Film} from "./entities/Film.entity";
import {Character} from "../Character/entities/Character.entity";
import {v4} from "uuid";
import {ValidationError} from "../utils/errors";

export class FilmService {
    public async fetchFilms(): Promise<SimplifiedFilm[]> {
        try {
            const response: AxiosResponse<FilmApiResponse> = await axiosSwapi.get('films');
            return response.data.results.map((film: RawFilm) => ({
                title: film.title,
                release_date: film.release_date,
                id: film.episode_id,
            }));
        } catch (error) {
            throw new Error('Error fetching films');
        }
    }

    async fetchFilmById(id: number) {
        try {
            const response: AxiosResponse<RawFilm> = await axiosSwapi.get(`films/${id}`);
            return response.data
        } catch (error) {
            throw new Error('Error fetching films');
        }
    }

    public async findOrCreateFilm(filmData: RawFilm, filmRepo: Repository<Film>, characters: Character[]): Promise<Film> {
        try {
            let film = await filmRepo.findOne({
                where: { title: filmData.title },
                relations: ["characters"]
            });

            if (!film) {
                film = filmRepo.create({
                    id: v4(),
                    title: filmData.title,
                    release_date: new Date(filmData.release_date),
                    characters: characters
                });
                await filmRepo.save(film);
            } else {
                film.characters = Array.from(new Set([...film.characters, ...characters]));
                await filmRepo.save(film);
            }
            return film;
        } catch (error) {
            console.error('Error while finding characters or creating film:', error);
            throw new ValidationError('Failed in creating film', 500);
        }
    }
}