'use strict';
const config = require('../configs/config');
const log = require('../utils/logger');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader =
            req.headers['authorization'] || req.headers['Authorization'];

        if (!authHeader?.startsWith('Bearer ')) {
            return res
                .status(401)
                .json({ message: 'Invalid or missing Authorization header' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, config.jwtToken, (err, user) => {
            if (err) {
                return res
                    .status(403)
                    .json({ message: 'Unauthorized to access this resource' });
            }

            req.user = user[0];
            next();
        });
    } catch (error) {
        log.error('Token verification error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = authenticateToken;
