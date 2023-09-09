import express from 'express';
import {myDataSource} from "./config/app-data-source";
import cors from 'cors';
import { Request, Response } from 'express';
import {handleError} from "./utils/errors";
import {filmRouter} from "./Film/filmRouter";
import {favoritesRouter} from "./Favorites/favoriteRouter";
export const app = express();



// establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })
// Middleware setup
app.use(cors());
app.use(express.json());
app.use(handleError);
app.use('/films', filmRouter);
app.use('/favorites', favoritesRouter);
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
