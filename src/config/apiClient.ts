import axios from 'axios';


const BASE_URL = 'https://swapi.dev/api';
export const axiosSwapi =  axios.create({
    baseURL: BASE_URL,
});

