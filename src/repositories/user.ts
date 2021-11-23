import dao from "./dao";
import dotenv from "dotenv";
import * as bcrypt from "bcrypt";
import User from "./../models/user"
import logger from "../loggers/winston";

// Load environment vars from .env
dotenv.config();

const saltRounds = Number(process.env.SALT_ROUNDS);

export default class {
    /**
     *  Use to get one user by email from SQLite
     * @param email
     */
    static async getUserByEmail(email: string): Promise<User> {
        const user = await dao.get("SELECT * FROM users WHERE email = ?", [email]);
        return user as User;
    }

    /**
     * Use to create one user in SQLite
     * @param user
     */
    static async createUser(user: User): Promise<boolean> {
        const hash = await bcrypt.hash(user.password, saltRounds);
        if (hash) {
            const insertUsers = `INSERT INTO users (name, lastname, email, password) VALUES (?,?,?,?);`
            try {
                await dao.run(insertUsers, [user.name, user.lastname, user.email, hash]);
                return true;
            } catch (ex) {
                logger.error(ex);
                return false;
            }
        }
        return false;
    }

}
