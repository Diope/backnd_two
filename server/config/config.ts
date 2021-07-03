export const configConstants = {
    env: process.env.NODE_ENV || 'development' || 'test',
    port: process.env.PORT || 4000,
    jwtAccess: process.env.JWT_ACCESS_TOKEN! || "SECRET_HERE",
    jwtRefresh: process.env.JWT_REFRESH_TOKEN! || "SECOND SECRET HERE"
}