'use strict';
const jwt = require('jsonwebtoken');
const config = require('../configs/config');
const RefreshToken = require('../users/models/token.model');
const generateAccessToken = (...user) => {
    const token = jwt.sign({ ...user }, config.jwtToken, {
        expiresIn: config.jwtExpires,
    });
    return token;
};
const generateRefreshToken = async (...user) => {
    const token = jwt.sign({ ...user }, config.jwtRefersh, {
        expiresIn: config.jwtExpires,
    });
    await RefreshToken.create({
        token,
        userId: user.map((u) => {
            return u._id;
        }),
        roleId: user?.roleId,
        // permissionId: user?.permissionId,
        sessionId: user?.sessionId
    });
    return token;
};
module.exports = { generateAccessToken, generateRefreshToken };
