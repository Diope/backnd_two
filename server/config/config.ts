export const config = {
    env: process.env.NODE_ENV || 'development' || 'test',
    port: process.env.PORT || '4000',
    jwtSecret: process.env.JWT_ACCESS_TOKEN! || "SECRET_HERE",
    jwtSecondarySecret: process.env.JWT_REFRESH_TOKEN! || "SECOND SECRET HERE"
}