import { DataSource } from "typeorm"
import {Character} from "../Character/entities/Character.entity";
import {Favorite} from "../Favorites/entities/Favorite.entity";
import {Film} from "../Film/entities/Film.entity";

export const myDataSource = new DataSource({
    type: "postgres",
    url:process.env.DATABASE_HOST,
    ssl: {
        rejectUnauthorized: true,  // This is for development, use `true` in production
    },
    synchronize:true,
    entities: [Character,Favorite,Film],
})