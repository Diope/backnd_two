"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configConstants = void 0;
exports.configConstants = {
    env: process.env.NODE_ENV || 'development' || 'test',
    port: process.env.PORT || 4000,
    jwtAccess: process.env.JWT_ACCESS_TOKEN || "SECRET_HERE",
    jwtRefresh: process.env.JWT_REFRESH_TOKEN || "SECOND SECRET HERE"
};
//# sourceMappingURL=config.js.map