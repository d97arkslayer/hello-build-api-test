import dotenv from 'dotenv';
import express from "express";
import logger from "./loggers/winston"; //import logger
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT; // port to listen

// Enable all CORS requests
app.use(cors());


// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});


// start the Express server
app.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
});
