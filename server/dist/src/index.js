"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const Users_1 = require("./resolvers/Users");
const typeorm_1 = require("typeorm");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = require("./entity/User");
const auth_1 = require("./utils/auth");
const sendRefreshToken_1 = require("./utils/sendRefreshToken");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    app.use(cookie_parser_1.default());
    app.get('/', (_req, res) => res.send("guten tag!"));
    app.post("/token_refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.cookies.ogedahsned;
        if (!token) {
            return res.send({ ok: false, accessToken: '' });
        }
        let payload;
        try {
            payload = jsonwebtoken_1.verify(token, process.env.JWT_REFRESH_TOKEN);
        }
        catch (err) {
            return res.status(400).json({ message: "access prohibited. Please log in" });
        }
        const user = yield User_1.User.findOne({ id: payload.userId, username: payload.username });
        if (!user) {
            return res.status(400).json({ message: "access prohibited. Please log in" });
        }
        if (user.tokenVersion !== payload.tokenVersion) {
            return res.status(400).json({ message: "access prohibited. Please log in" });
        }
        sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(user));
        return res.status(200).json({ accessToken: auth_1.createAccessToken(user) });
    }));
    yield typeorm_1.createConnection();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [Users_1.UserResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    });
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log("Server started on port 4000. Good to go!");
    });
}))();
//# sourceMappingURL=index.js.map