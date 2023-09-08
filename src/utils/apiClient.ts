import axios from 'axios';


const BASE_URL = 'https://swapi.dev/api/';
export default axios.create({
    baseURL: BASE_URL,
    headers:{'Content-Type':"application/json"}
});

