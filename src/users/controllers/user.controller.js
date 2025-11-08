'use strict';
const asyncWrapper = require('../../utils/catchAsync');
const User = require('../models/user.model');
const { generateAccessToken } = require('../../utils/jwtToken');
const { generateRefreshToken } = require('../../utils/jwtToken');
const { successResponse, failedResponse } = require('../../utils/response');
const log = require('../../utils/logger');
const APIFeatures = require('../../utils/apiFeatures');

const userCreate = asyncWrapper(async (req, res) => {
    const { username, email, password, roleId, 
        // permissionId 
    } = req.body;
    try {
        const user = new User({
            username,
            email,
            password,
            roleId,
            // permissionId,
            sessionId: req?.sessionID,
        });
        await user.save();
        const accessToken = generateAccessToken({
            _id: user?._id,
            email: user?.email,
            roleId: user?.roleId,
            // permissionId: user?.permissionId,
            sessionId: req?.sessionID,
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
});

const userGet = asyncWrapper(async (req, res) => {
    try {
        const query = User.find(
            {},
            { createdAt: 0, updatedAt: 0, __v: 0 }
        ).populate('roleId', { createdAt: 0, updatedAt: 0, __v: 0 });
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
        }).populate({
            path: 'roleId',
            model: 'Role',
            select: '-createdAt -updatedAt -__v',
            populate: {
                path: 'permissionId',
                model: 'Permission',
                select: '-createdAt -updatedAt -__v',
            },
        });
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
    userCreate,
    userGet,
    userGetOne,
    userUpdate,
    userDelete,
};
