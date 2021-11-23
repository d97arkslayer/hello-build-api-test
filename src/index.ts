import dotenv from 'dotenv';
import express from "express";
import logger from "./loggers/winston"; // import logger
import cors from "cors";
import bodyParser from "body-parser";
import dao from "./repositories/dao";
import userRoutes from "./routes/user";
import i18next from "i18next";
import i18nBackend from "i18next-fs-backend";
import i18nextMiddleware from "i18next-http-middleware";

// Load .env data
dotenv.config();
// tslint:disable-next-line:no-console
console.log(__dirname + '/../resources/locales/{{lng}}/{{ns}}.json');
// Internationalization config
i18next
    .use(i18nextMiddleware.LanguageDetector)
    .use(i18nBackend)
    .init({
        backend: {
            loadPath: __dirname + '/resources/locales/{{lng}}/{{ns}}.json'
        },
        fallbackLng: 'en',
        preload: ['en', 'es']
    });

const app = express();
const port = process.env.PORT; // port to listen

// start SQLite database
dao.setupDbForDev();
// Enable all CORS requests
app.use(cors());
app.use(i18nextMiddleware.handle(i18next))
// start the Express server
app.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
});

// Use body parser for json requests
app.use(bodyParser.json());


// Use user routes
app.use('/api/users', userRoutes)
