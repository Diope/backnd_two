// import { config } from "config/config";
import { sign } from "jsonwebtoken";
import { User } from "../entity/User";
import {configConstants} from '../config/config'

export const createAccessToken = (user: User) => {
    return sign({userId: user.id, username: user.username}, configConstants.jwtAccess, {expiresIn: '60m'});
}

export const createRefreshToken = (user: User) => {
    return sign({userId: user.id, username: user.username, tokenVersion: user.tokenVersion}, configConstants.jwtRefresh, {
        expiresIn: '7d'
    });
}