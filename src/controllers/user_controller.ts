import UserRepository from "./../repositories/user"
import FavoriteRepository from "./../repositories/favorite"
import * as bcrypt from "bcrypt";
import {Request, Response} from "express";
import User from "./../models/user"
import logger from "../loggers/winston";
import {sessionToken} from "../utils/jwt";
import Favorite from "../models/favorite";

/**
 * Use to return unauthorized status response
 * @param res
 * @param req
 */
const invalidCredentials = (req: Request, res: Response) => {
    res.status(401);
    // @ts-ignore
    return res.json({error: req.t('unauthorized.credentials')});
}

/**
 * Use to return bad request status response
 * @param req
 * @param res
 */
const badRequestDuplicateEmail = (req: Request, res: Response) => {
    res.status(400);
    return res.json({error: req.t("bad_request.duplicate_email")})
}

/**
 * Use to return not found status response
 * @param req
 * @param res
 */
const favoriteNotFound = (req: Request, res: Response) => {
    res.status(404);
    return res.json({error: req.t("not_found.favorite")});
}

/**
 * Use to return not authorized status response
 * @param req
 * @param res
 */
const notBelongsToYou = (req: Request, res: Response) => {
    res.status(401);
    return res.json({error: req.t("unauthorized.deleting_favorite")});
}
/**
 * Use to make login with registered user in the database
 * @param req
 * @param res
 */
export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const user = await UserRepository.getUserByEmail(email) as User;
    if (!user) {
        return invalidCredentials(req, res)
    }
    // Compare the encrypted password vs  plain text password in the request
    bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
            delete user.password
            const token = await sessionToken(user);
            return res.status(200).json({user, token})
        } else {
            return invalidCredentials(req, res)
        }
    })
}

/**
 * Use to create a new user in the SQLite database
 * @param req
 * @param res
 */
export const signup = async (req: Request, res: Response) => {
    const user: User = req.body;
    const existUser = await UserRepository.getUserByEmail(user.email) as User;
    if (existUser) {
        return badRequestDuplicateEmail(req, res)
    }
    const created: boolean = await UserRepository.createUser(user)
    if (!created) {
        const error: Error = new Error(req.t("server_error.creating_user"));
        return res.status(500).send({error: error.message});
    }
    return res.status(201).json({message: req.t("created.user")});

}

/**
 * Use to get favorites repos from user
 * @param req
 * @param res
 */
export const getFavorites = async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.decoded;
    const favorites = await UserRepository.getFavorites(user.id)
    return res.status(200).json(favorites)
}

/**
 * Use to add Favorite repo to database
 * @param req
 * @param res
 */
export const addFavorite = async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.decoded;
    const favorite: Favorite = req.body;
    favorite.user_id = user.id;
    let favorites: Favorite[] = await UserRepository.getFavorites(user.id);
    const existsFavorite = await FavoriteRepository.getFavoriteByUserAndGithubId(favorite.github_id, user.id);
    if (existsFavorite) {
        return res.status(200).json(favorites);
    }
    const created: boolean = await FavoriteRepository.createFavorite(favorite);
    if (!created) {
        const error: Error = new Error(req.t("server_error.creating_favorite"));
        return res.status(500).send({error: error.message});
    }
    favorites = await UserRepository.getFavorites(user.id);
    return res.status(201).json(favorites);
}

/**
 * deleteFavorite use to delete a favorite from database
 * @param req
 * @param res
 */
export const deleteFavorite = async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.decoded;
    const {favorite_id: favoriteId} = req.body;
    const favorite: Favorite = await FavoriteRepository.getFavoriteById(favoriteId);
    if (!favorite) {
        return favoriteNotFound(req, res);
    }
    if (favorite.user_id !== user.id) {
        return notBelongsToYou(req, res);
    }
    const deleted = await FavoriteRepository.deleteFavorite(favorite);
    if (!deleted) {
        const error: Error = new Error(req.t("server_error.deleting_favorite"));
        return res.status(500).json({error: error.message});
    }
    return res.status(200).json({message: req.t("deleted.favorite")})
}
