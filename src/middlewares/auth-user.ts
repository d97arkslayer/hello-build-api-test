import UserRepository from "./../repositories/user";
import {Request, Response, NextFunction} from "express";
import {verify} from "../utils/jwt";

/**
 * Use to return unauthorized status response
 * @param res
 * @param req
 */
const unauthorized = (req: Request, res: Response) => {
    res.status(401);
    // @ts-ignore
    return res.json({error: req.t('unauthorized')});
}

/**
 * Middleware to get user from token
 * @param req
 * @param res
 * @param next
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return unauthorized(req, res);
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = await verify(token);
        if (!decoded) {
            return unauthorized(req, res);
        }
        // @ts-ignore
        const user = await UserRepository.getUserById(decoded.id);
        if (!user) {
            return unauthorized(req, res);
        }
        // @ts-ignore
        req.decoded = user;
        next();
    } catch (error) {
        return next(error)
    }
}
