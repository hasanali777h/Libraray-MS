'use strict';
const asyncWrapper = require('../../utils/catchAsync');
const Role = require('../models/role.model');
const { successResponse, failedResponse } = require('../../utils/response');
const log = require('../../utils/logger');
const APIFeatures = require('../../utils/apiFeatures');

const roleCreate = asyncWrapper(async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json(
            successResponse('role created successfully', role)
        );
    } catch (error) {
        log.error(error);
    }
});

const roleGet = asyncWrapper(async (req, res) => {
    try {
        const query = Role.find(
            {},
            { createdAt: 0, updatedAt: 0, __v: 0, 'restrictions._id':0 }
        ).populate('permissionId', { createdAt: 0, updatedAt: 0, __v: 0});
        const result = new APIFeatures(query, req.query)
            .search(['role'])
            .filter()
            .select()
            .sort()
            .paginate();
        const role = await result.query;
        const count = await Role.countDocuments(result.query.getQuery());
        const totalPages = Math.ceil(count / result.limit);
        res.status(200).json(
            successResponse('role fetched successfully', {
                page: result.page,
                limit: result.limit,
                totalDocs: count,
                totalPages,
                data: role,
            })
        );
    } catch (error) {
        log.error(error);
    }
});

const roleGetOne = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json(failedResponse('ID not found', null));
        }
        const role = await Role.findById(id, {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        });
        res.status(200).json(role);
    } catch (error) {
        log.error(error);
    }
});

const roleUpdate = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json(failedResponse('ID not found', null));
        }
        const role = await Role.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(role);
    } catch (error) {
        log.error(error);
    }
});

const roleDelete = asyncWrapper(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json(failedResponse('ID not found', null));
        }
        const role = await Role.findByIdAndDelete(id);
        res.status(200).json(role);
    } catch (error) {
        log.error(error);
    }
});

module.exports = {
    roleCreate,
    roleGet,
    roleGetOne,
    roleUpdate,
    roleDelete,
};
