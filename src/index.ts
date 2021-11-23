import dotenv from 'dotenv';
import express from "express";
import logger from "./loggers/winston"; // import logger
import cors from "cors";
import bodyParser from "body-parser";
import dao from "./repositories/dao";
import userRoutes from "./routes/user";

// Change .env data
dotenv.config();

const app = express();
const port = process.env.PORT; // port to listen

// start SQLite database
dao.setupDbForDev();
// Enable all CORS requests
app.use(cors());
// start the Express server
app.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
});

// Use body parser for json requests
app.use(bodyParser.json());


// Use user routes
app.use('/api/users', userRoutes)
