import { verify } from "jsonwebtoken"
import { MyContext } from "../utils/MyContext"
import { Middleware } from "type-graphql/dist/interfaces/Middleware";


export const isAuthorized: Middleware<MyContext> = ({context}, next) => {
    const authorization = context.req.headers['authorization']

    if (!authorization) {
        throw new Error ('You are not authenticated, please log in first')
    }

    try {
        // console.log(authorization.split(' '));
        const token = authorization.split(' ')[1];  // bearer
        let payload = verify(token, process.env.JWT_ACCESS_TOKEN!) as any;
        context.payload = payload;
    
    } catch (err) {
        console.log(err)
        throw new Error("You are not authenticated , please log in first")
    }
    return next()
}