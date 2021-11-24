import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Use to generate jwt token for logged user
 * @param data
 */
export const sessionToken = async (data: any) => {
    const token = await jwt.sign(data, JWT_SECRET, {expiresIn: '8h'})
    return token;
}

/**
 * Verify the jwt
 * @param token
 */
export const verify = async (token: string) => {
    const decoded = await jwt.verify(token, JWT_SECRET);
    return decoded;
}


