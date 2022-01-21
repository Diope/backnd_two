"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const isAuthorized = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];
    if (!authorization) {
        throw new Error('You are not authenticated, please log in first');
    }
    try {
        const token = authorization.split(' ')[1];
        context.payload = jsonwebtoken_1.verify(token, process.env.JWT_ACCESS_TOKEN);
    }
    catch (err) {
        console.log(err);
        throw new Error("You are not authenticated , please log in first");
    }
    return next();
};
exports.isAuthorized = isAuthorized;
//# sourceMappingURL=isAuthorized.js.map