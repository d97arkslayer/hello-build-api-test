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
        const insertFavorites = "INSERT INTO favorites (name, user_id, github_id, description, owner, created_at) VALUES (?,?,?,?,?,?);";
        try {
            await dao.run(insertFavorites, [favorite.name, favorite.user_id, favorite.github_id, favorite.description, favorite.owner, favorite.created_at]);
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
     * @param githubId
     * @param userId
     */
    static async getFavoriteByUserAndGithubId(githubId: string, userId: number) {
        const favorite = await dao.get("SELECT * FROM favorites WHERE user_id = ? and github_id=?;", [userId, githubId]);
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
