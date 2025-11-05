'use strict';
require('dotenv/config');
const config = {
    port: process.env.PORT,
    uri: process.env.MONGO_URI,
    jwtToken: process.env.JWT_SECRET,
    jwtRefersh: process.env.JWT_REFRESH,
    jwtExpires: process.env.JWT_EXPIRES_IN,
};
module.exports = config;
