import UserRepository from "./../repositories/user"
import * as bcrypt from "bcrypt";
import {Request, Response} from "express";
import User from "./../models/user"
import logger from "../loggers/winston";

/**
 * Use to return unauthorized status response
 * @param res
 * @param req
 */
const invalidCredentials = (req: Request, res: Response) => {
    res.status(401);
    // @ts-ignore
    return res.json({error: req.t('unauthorized')});
}

/**
 * Use to return bad request status response
 * @param res
 */
const badRequestDuplicateEmail = (req: Request, res: Response) => {
    res.status(400);
    return res.json({error: req.t("bad_request.duplicate_email")})
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
    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            delete user.password
            return res.status(200).json(user)
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
    if (created) {
        return res.status(201).json({message: req.t("created.user")});
    } else {
        const error: Error = new Error(req.t("server_error.creating_user"));
        return res.status(500).send({error: error.message});
    }
}
