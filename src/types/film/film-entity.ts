export interface RawFilm {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
    characters: string[];
    planets: string[];
    starships: string[];
    vehicles: string[];
    species: string[];
    created: string;
    edited: string;
    url: string;
}

export interface SimplifiedFilm {
    title: string;
    release_date: string;
    id: number;
}

export interface FilmApiResponse  {
    count: number;
    next: null | string; // Replace with the correct type if known
    previous: null | string; // Replace with the correct type if known
    results: RawFilm[];
};