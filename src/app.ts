import express from 'express';
import 'reflect-metadata';
import {myDataSource} from "./config/app-data-source";
import cors from 'cors';
import {handleError} from "./utils/errors";
import {filmRouter} from "./Film/filmRouter";
import {favoritesRouter} from "./Favorites/favoriteRouter";
import rateLimit from "express-rate-limit";
import * as dotenv from 'dotenv'
dotenv.config();



// Enable rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});



// establish database connection

myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })
// Apply the rate limiter to all requests
export const app = express();
app.set('trust proxy', 1);
app.use(limiter);
// Middleware setup
app.use(cors());
app.use(express.json());

app.use('/films', filmRouter);
app.use('/favorites', favoritesRouter);
app.use(handleError);

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
