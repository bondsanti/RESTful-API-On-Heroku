require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    DOMAIN: process.env.DOMAIN,
    JSON_TOKEN_SECRET: process.env.JSON_TOKEN_SECRET
}