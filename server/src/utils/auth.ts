// import { config } from "config/config";
import { sign } from "jsonwebtoken";
import { User } from "src/entity/User";

export const createAccessToken = (user: User) => {
    return sign({userId: user.id, username: user.username}, process.env.JWT_ACCESS_TOKEN!, {expiresIn: '10m'});
}

export const createRefreshToken = (user: User) => {
    return sign({userId: user.id, username: user.username}, process.env.JWT_REFRESH_TOKEN!, {
        expiresIn: '7d'
    });
}