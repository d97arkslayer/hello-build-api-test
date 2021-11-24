import dao from "./dao";
import dotenv from "dotenv";
import Favorite from "./../models/favorite";
import logger from "../loggers/winston";

// Load environment vars from .env
dotenv.config();

export default class {

    /**
     * Use to create one user in SQLite
     * @param favorite
     */
    static async createFavorite(favorite: Favorite): Promise<boolean> {
        const insertFavorites = "INSERT INTO favorites (name, url, user_id) VALUES (?,?,?);";
        try {
            await dao.run(insertFavorites, [favorite.name, favorite.url, favorite.user_id]);
            return true;
        } catch (ex) {
            logger.error(ex);
            return false;
        }
    }

    /**
     * Use to delete favorite
     * @param favorite
     */
    static async deleteFavorite(favorite: Favorite): Promise<boolean> {
        const deleteFavorites = "delete from favorites where id = ?;";
        try {
            await dao.run(deleteFavorites, [favorite.id]);
            return true;
        } catch (ex) {
            logger.error(ex);
            return false;
        }
    }

    /**
     * Use to get favorite by user and url
     * @param url
     * @param userId
     */
    static async getFavoriteByUserAndUrl(url: string, userId: number) {
        const favorite = await dao.get("SELECT * FROM favorites WHERE user_id = ? and url=?;", [userId, url]);
        return favorite as Favorite;
    }

    /**
     *  Use to get one user by email from SQLite
     * @param id
     */
    static async getFavoriteById(id: number): Promise<Favorite> {
        const favorite = await dao.get("SELECT * FROM favorites WHERE id = ?", [id]);
        return favorite as Favorite;
    }

}
