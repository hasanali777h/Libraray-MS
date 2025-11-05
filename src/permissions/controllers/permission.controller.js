'use strict';
const asyncWrapper = require('../../utils/catchAsync');
const Permission = require('../models/permission.model');

const permissionCreate = asyncWrapper(async (req, res) => {
    const permission = await Permission.create(req.body);
    res.status(201).json(permission);
});

const permissionGet = asyncWrapper(async (req, res) => {
    const permission = await Permission.find(
        {},
        { createdAt: 0, updatedAt: 0, __v: 0 }
    );
    const count = await Permission.countDocuments();
    res.status(200).json({ totalDocs: count, data: permission });
});

const permissionGetOne = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const permission = await Permission.findById(id, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    });
    res.status(200).json(permission);
});

const permissionUpdate = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const permission = await Permission.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    res.status(200).json(permission);
});

const permissionDelete = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const permission = await Permission.findByIdAndDelete(id);
    res.status(200).json(permission);
});

module.exports = {
    permissionCreate,
    permissionGet,
    permissionGetOne,
    permissionUpdate,
    permissionDelete,
};
