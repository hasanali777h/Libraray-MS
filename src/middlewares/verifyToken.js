'use strict';
const config = require('../configs/config')
const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
    const authHeader =
        req.headers['authorization'] || req.headers['Authorization']
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)
    jwt.verify(token, config.jwtToken, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user[0]
        next()
    })
}
module.exports = authenticateToken
