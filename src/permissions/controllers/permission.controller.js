'use strict';
const asyncWrapper = require('../../utils/catchAsync');
const Permission = require('../models/permission.model');
const { successResponse, failedResponse } = require('../../utils/response');
const log = require('../../utils/logger');
const APIFeatures = require('../../utils/apiFeatures');

const permissionCreate = asyncWrapper(async (req, res) => {
    try {
        const permission = await Permission.create(req.body);
        res.status(201).json(permission);
    } catch (error) {
        log.error(error);
    }
});

const permissionGet = asyncWrapper(async (req, res) => {
    try {
        const query = Permission.find(
            {},
            { createdAt: 0, updatedAt: 0, __v: 0 }
        );
        const result = new APIFeatures(query, req.query)
        .search(['module', 'actions'])
        .filter()
        .select()
        .sort()
        .paginate();
        const permission = await result.query;
        const count = await Permission.countDocuments(result.query.getQuery());
        const totalPages = Math.ceil(count / result.limit);
        res.status(200).json(
            successResponse('permissions fetched successfully', {
                page: result.page,
                limit: result.limit,
                totalDocs: count,
                totalPages,
                data: permission,
            })
        );
    } catch (error) {
        log.error(error);
    }
});

const permissionGetOne = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json(failedResponse('ID not found', null));
        }
        const permission = await Permission.findById(id, {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        });
        res.status(200).json(
            successResponse('permission fetched successfully', permission)
        );
    } catch (error) {
        log.error(error);
    }
});

const permissionUpdate = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json(failedResponse('ID not found', null));
        }
        const permission = await Permission.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(
            successResponse('permission updated successfully', permission)
        );
    } catch (error) {
        log.error(error);
    }
});

const permissionDelete = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json(failedResponse('ID not found', null));
        }
        const permission = await Permission.findByIdAndDelete(id);
        res.status(200).json(
            successResponse('permission deleted successfully', permission)
        );
    } catch (error) {
        log.error(error);
    }
});

module.exports = {
    permissionCreate,
    permissionGet,
    permissionGetOne,
    permissionUpdate,
    permissionDelete,
};
