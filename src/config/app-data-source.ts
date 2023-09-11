import { DataSource } from "typeorm"
import {Character} from "../Character/entities/Character.entity";
import {Favorite} from "../Favorites/entities/Favorite.entity";
import {Film} from "../Film/entities/Film.entity";

export let myDataSource:DataSource
    if(process.env.DATABASE_URL){
        myDataSource = new DataSource({
            type: "postgres",
            url:process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
            synchronize:true,
            entities: [Character,Favorite,Film],
        })
    }else{
        myDataSource = new DataSource({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "",
            database: "postgres",
            entities: [Character,Favorite,Film],
        })
    }