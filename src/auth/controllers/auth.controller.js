'use strict';
const asyncWrapper = require('../../utils/catchAsync');
const User = require('../../users/models/user.model');
const RefreshToken = require('../../users/models/token.model');
const { generateAccessToken } = require('../../utils/jwtToken');
const { generateRefreshToken } = require('../../utils/jwtToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../configs/config');
const { successResponse, failedResponse } = require('../../utils/response');
const log = require('../../utils/logger');
const { userCreate } = require('../../users/controllers/user.controller');

const register = asyncWrapper(async (req, res) => {
    try {
        const user = await userCreate(req);
        return res
            .status(200)
            .json(successResponse('user registration successfull', user));
    } catch (error) {
        log.error(error);
        res.status(500).json(failedResponse('user registration failed', error));
    }
});

const login = asyncWrapper(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const checkPass = await bcrypt.compare(password, user.password);
        if (!user || !checkPass) {
            return res.status(404).json(failedResponse('user not exist', null));
        }
        const accessToken = generateAccessToken({
            _id: user?._id,
            email: user?.email,
            roleId: user?.roleId,
            // permissionId: user?.permissionId,
            sessionId: req?.sessionID
        });
        const refreshToken = await generateRefreshToken(user);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
        });
        return res.status(200).json(
            successResponse('user logged in successfully', {
                user,
                accessToken,
                refreshToken,
            })
        );
    } catch (error) {
        log.error(error);
        res.status(500).json(failedResponse('user logging failed', error));
    }
});

const token = asyncWrapper(async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res
                .sendStatus(401)
                .json(failedResponse('Unauthorized exception of token', null));
        }
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        if (!storedToken) {
            return res
                .sendStatus(403)
                .json(failedResponse('Forbiidden exception of token', null));
        }
        jwt.verify(refreshToken, config.jwtRefersh, (err, user) => {
            if (err) {
                return res
                    .sendStatus(403)
                    .json(failedResponse('error in token verifying', err));
            }
            const accessToken = generateAccessToken({
                _id: user[0]?._id,
                email: user[0]?.email,
                roleId: user[0]?.roleId,
                // permissionId: user[0]?.permissionId,
                sessionId: req?.sessionID
            });
            res.status(200).json(
                successResponse('refresh token generated successfully', {
                    accessToken,
                })
            );
        });
    } catch (error) {
        log.error(error);
        res.status(500).json(
            failedResponse('refresh token generation failed', error)
        );
    }
});

const logout = asyncWrapper(async (req, res) => {
    try {
        const refreshToken = req?.cookies?.refreshToken;
        if (!refreshToken) return res.sendStatus(204);
        await RefreshToken.deleteOne({ token: refreshToken });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
        });
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        log.error(error);
    }
});

module.exports = {
    register,
    login,
    token,
    logout,
};
