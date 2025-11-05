'use strict';
const asyncWrapper = require('../../utils/catchAsync');
const User = require('../models/user.model');
const RefreshToken = require('../models/token.model');
const { generateAccessToken } = require('../../utils/jwtToken');
const { generateRefreshToken } = require('../../utils/jwtToken');
const bcrypt = require('bcrypt');
const config = require('../../configs/config');
const { successResponse, failedResponse } = require('../../utils/response');
const log = require('../../utils/logger');
const APIFeatures = require('../../utils/apiFeatures');

const register = asyncWrapper(async (req, res) => {
    try {
        const user = await userCreate(req.body);
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
            permissionId: user?.permissionId,
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
        const refreshToken = req.body.token || req.cookies.refreshToken;
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
                _id: user._id,
                username: user.username,
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
        const refreshToken = req.body.token || req.cookies.refreshToken;
        await RefreshToken.deleteOne({ token: refreshToken });
        res.clearCookie('refreshToken');
        res.sendStatus(204);
    } catch (error) {
        log.error(error);
    }
});

const userCreate = asyncWrapper(
    async ({ username, email, password, roleId, permissionId }) => {
        try {
            const user = new User({
                username,
                email,
                password,
                roleId,
                permissionId,
            });
            await user.save();
            const accessToken = generateAccessToken({
                _id: user?._id,
                email: user?.email,
                roleId: user?.roleId,
                permissionId: user?.permissionId,
            });
            const refreshToken = await generateRefreshToken(user);
            return successResponse('user created successfully', {
                ...user._doc,
                accessToken,
                refreshToken,
            });
        } catch (error) {
            log.error(error);
            res.status(500).json(failedResponse('user creation failed', error));
        }
    }
);

const userGet = asyncWrapper(async (req, res) => {
    try {
        const query = User.find({}, { __v: 0, createdAt: 0, updatedAt: 0 })
            .populate('roleId', { __v: 0, createdAt: 0, updatedAt: 0 })
            .populate('permissionId', { __v: 0, createdAt: 0, updatedAt: 0 });
        const result = new APIFeatures(query, req.query)
            .search(['username', 'email'])
            .filter()
            .select()
            .sort()
            .paginate();
        const users = await result.query;
        const count = await User.countDocuments(result.query.getQuery());
        const totalPages = Math.ceil(count / result.limit);
        res.status(200).json(
            successResponse('users fetched successfully', {
                page: result.page,
                limit: result.limit,
                totalDocs: count,
                totalPages,
                data: users,
            })
        );
    } catch (error) {
        log.error(error);
        res.status(500).json(failedResponse('failed in fetching users', error));
    }
});

const userGetOne = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id, {
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
        })
            .populate('roleId', { __v: 0, createdAt: 0, updatedAt: 0 })
            .populate('permissionId', { __v: 0, createdAt: 0, updatedAt: 0 })
            .exec();
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
});

const userUpdate = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
});

const userDelete = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
});

module.exports = {
    register,
    login,
    token,
    logout,
    userCreate,
    userGet,
    userGetOne,
    userUpdate,
    userDelete,
};
