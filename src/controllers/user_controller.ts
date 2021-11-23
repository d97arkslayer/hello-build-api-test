import UserRepository from "./../repositories/user"
import * as bcrypt from "bcrypt";
import {Request, Response} from "express";
import User from "./../models/user"
import logger from "../loggers/winston";

// Func to return unauthorized status
const invalidCredentials = (res: Response) => {
    res.status(401);
    return res.json({error: 'Invalid email or password'});
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const user = await UserRepository.getUserByEmail(email) as User;

    if (!user) {
        return invalidCredentials(res)
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            delete user.password
            return res.status(200).json(user)
        } else {
            return invalidCredentials(res)
        }
    })
}


export const signup = async (req: Request, res: Response) => {
    const user: User = req.body;
    const created: boolean = await UserRepository.createUser(user)
    if (created) {
        return res.status(201).json({message: "Success! You have successfully signed up. Please login to continue."});
    } else {
        const error: Error = new Error("Oh no! There was an error signing up. Please try again.");
        return res.status(500).send({error: error.message});
    }
}
