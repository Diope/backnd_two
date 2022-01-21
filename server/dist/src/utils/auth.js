"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config/config");
const createAccessToken = (user) => {
    return jsonwebtoken_1.sign({ userId: user.id, username: user.username }, config_1.configConstants.jwtAccess, { expiresIn: '10m' });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (user) => {
    return jsonwebtoken_1.sign({ userId: user.id, username: user.username, tokenVersion: user.tokenVersion }, config_1.configConstants.jwtRefresh, {
        expiresIn: '7d'
    });
};
exports.createRefreshToken = createRefreshToken;
//# sourceMappingURL=auth.js.map