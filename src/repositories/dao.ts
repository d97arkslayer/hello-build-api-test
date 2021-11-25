import * as sqlite from "sqlite3";

const sqlite3 = sqlite.verbose();
import * as bcrypt from "bcrypt";
import logger from "../loggers/winston";
import dotenv from "dotenv";

/**
 * Use to init the database in memory
 */
const db = new sqlite3.Database(':memory:', err => {
    if (err) {
        logger.error(err.message)
    }
});

// load config from .env
dotenv.config();

const saltRounds = Number(process.env.SALT_ROUNDS);

export default class {

    static setupDbForDev() {
        db.serialize(() => {
            //   Drop Tables:
            const dropUsersTable = "DROP TABLE IF EXISTS users";
            db.run(dropUsersTable);

            const dropFavoritesTable = "DROP TABLE IF EXISTS favorites";
            db.run(dropFavoritesTable);

            // Create Tables:
            const createUsersTable = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, lastname TEXT,email TEXT, password TEXT)";
            db.run(createUsersTable);

            const createFavoritesTable = "CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY AUTOINCREMENT,  user_id INTEGER, name TEXT,description TEXT, github_id TEXT, created_at TEXT, owner TEXT)";
            db.run(createFavoritesTable);

            // Insert one default user
            const password = '123'
            bcrypt.hash(password, saltRounds, (err, hash) => {
                const insertUsers = `INSERT INTO users (name, lastname,email, password) VALUES ('foo', 'bar','foo@bar.com','${hash}');`
                db.run(insertUsers);
            });
        });
    }

    /**
     * Use to get one record based in where clause
     * @param stmt sql conditions
     * @param params this is the parameters to exec the query
     */
    static get(stmt: string, params: any[]) {
        return new Promise((res, rej) => {
            db.get(stmt, params, (error, result) => {
                if (error) {
                    return rej(error.message);
                }
                return res(result);
            });
        })
    }

    /**
     * Use to get all records with conditions
     * @param stmt
     * @param params
     */
    static all(stmt: string, params: any[]) {
        return new Promise((res, rej) => {
            db.all(stmt, params, (error, result) => {
                if (error) {
                    return rej(error.message);
                }
                return res(result);
            });
        });
    }

    /**
     * Use to run raw queries in SQLite engine
     * @param stmt raw query
     * @param params parameters to execute the query
     */
    static run(stmt: string, params: any[]) {
        return new Promise((res, rej) => {
            db.run(stmt, params, (error: any, result: any) => {
                if (error) {
                    return rej(error.message);
                }
                return res(result);
            });
        })
    }


}
