export const config = {
    env: process.env.NODE_ENV || 'development' || 'test',
    port: process.env.PORT || '4000',
    jwtSecret: process.env.JWT_SECRET || "SECRET_HERE",
}