import { DataSource } from "typeorm"
import {Character} from "../Character/entities/Character.entity";
import {Favorite} from "../Favorites/entities/Favorite.entity";
import {Film} from "../Film/entities/Film.entity";
const dbHost = process.env.DATABASE_HOST || 'localhost';

export const myDataSource = new DataSource({
    type: "postgres",
    host: dbHost,
    port: 5432,
    username: "postgres",
    password: "",
    database: "postgres",
    entities: [Character,Favorite,Film],
})