import "dotenv/config";
import "reflect-metadata";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/Users";
import { createConnection } from "typeorm";
import cookieParser = require("cookie-parser");
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./utils/auth";
import { sendRefreshToken } from "./utils/sendRefreshToken";



    const app = express();
    app.use(cookieParser());
    app.get('/', (_req, res) => res.send("guten tag!"));
    app.post("/token_refresh", async (req, res) => {
        const token = req.cookies.ogedahsned
        if (!token) return res.send({ok: false, accessToken: ''})


        let payload: any;
        try {
            payload = verify(token, process.env.JWT_REFRESH_TOKEN!)
        } catch (err) {
            return res.status(400).json({message: "access prohibited. Please log in"});
        }
        const user = await User.findOne({id: payload.userId, username: payload.username});
        if (!user) {
            return res.status(400).json({message: "access prohibited. Please log in"});
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            return res.status(400).json({message: "access prohibited. Please log in"});
        }
        
        // Send back an access token
        sendRefreshToken(res, createRefreshToken(user));

        return res.status(200).json({accessToken: createAccessToken(user)})
    })


    let apolloServer;
    async function startServer() {
        await createConnection()
        apolloServer = new ApolloServer({
            schema: await buildSchema({
                resolvers: [UserResolver]
            }),
            context: ({req, res}) => ({req, res})
        });
        await apolloServer.start()
        apolloServer.applyMiddleware({app});
    }
    startServer();
    app.listen(4000, () => {
        console.log("Server started on port 4000. Good to go!")
    });


// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.username = "Timber";
//     user.email = "monica@firstnight.com";
//     user.password = "testuser1"
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
