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
import {JsonWebTokenError} from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

// Load .env data
dotenv.config();
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

/**
 * Not route found handler.
 */
app.use((req, res, next) => {
    const err = new Error('Content not Found');
    // @ts-ignore
    err.status = 404;
    // @ts-ignore
    err.errors = {
        url: [`The ${req.originalUrl} not exist`],
    };
    next(err);
});


/**
 * Error handler.
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Internal errors
    // @ts-ignore
    if (!err.status) {
        // @ts-ignore
        err.status = 500;
    }
    // @ts-ignore
    const content = {
        // @ts-ignore
        statusCode: err.status,
        endpoint: req.originalUrl,
        method: req.method,
        message: err.message,
        headers: req.headers,
        body: req.body,
    };

    // @ts-ignore
    if (err.status >= 400 && err.status < 500) {
        // @ts-ignore
        logger.info(err, content);
    }
    // @ts-ignore
    if (err.status >= 500) {
        // @ts-ignore
        logger.error(err, content);
    }
    if (err instanceof JsonWebTokenError) {
        // @ts-ignore
        err.status = 401;
        // @ts-ignore
        err.errors = err.data;
        err.message = 'Invalid token';
    }


    // @ts-ignore
    res.status(err.status || 500);

    res.json({
        message: err.message,
        // @ts-ignore
        errors: err.errors || {},
        // @ts-ignore
        status: err.status,
        // @ts-ignore
        type: err.type || null,
        // @ts-ignore
        data: err.data || null,
    }).end();
});
