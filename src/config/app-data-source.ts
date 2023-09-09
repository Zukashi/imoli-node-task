import { DataSource } from "typeorm"
import {Character} from "../Character/entities/Character.entity";
import {Favorite} from "../Favorites/entities/Favorite.entity";
import {Film} from "../Film/entities/Film.entity";

export const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "postgres",
    entities: [Character,Favorite,Film],
    logging: true,
    synchronize: true,
})